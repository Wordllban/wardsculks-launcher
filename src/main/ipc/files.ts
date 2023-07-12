import { ipcMain, BrowserWindow, shell } from 'electron';
import { dirname, basename, join } from 'path';
import { existsSync, mkdirSync, readFile, writeFile, stat } from 'fs';
import pLimit from 'p-limit';
import getAppDataPath from 'appdata-path';
import { promisify } from 'util';
import { EOL } from 'os';
import {
  GAME_FOLDER_NAME,
  LAUNCH_OPTIONS_FILE,
  MAX_REQUEST_RETRIES,
} from '../../constants/files';
import MenuBuilder from '../menu';
import { sleep } from '../util';
import {
  checkFileExists,
  downloadFile,
  generateLaunchMinecraftCommand,
  getFolderSize,
  getServerFolder,
  verifyFolder,
} from './utils';
import { getMainWindow } from '../main';
import { formatBytes } from '../../utils';
import { IFileInformation, LauncherLogs } from '../../types';
import getAxios from '../services/axios';

/**
 * IPC handlers related to file system
 */

interface IRelease {
  files: Record<string, IFileInformation>;
  totalSize: number;
}

ipcMain.on('open-remote-file', async (_, url) => {
  const window = new BrowserWindow({
    webPreferences: {
      plugins: true,
      contextIsolation: true,
      sandbox: true,
    },
  });

  const menuBuilder = new MenuBuilder(window);
  menuBuilder.buildMenu();

  window.loadURL(url);
});

ipcMain.on('game-install', async (_, serverInfo: string[]) => {
  const main = getMainWindow();
  const [serverId, serverName] = serverInfo;
  const serverFolderPath = getAppDataPath(`${GAME_FOLDER_NAME}/${serverName}`);
  // create game folder
  mkdirSync(serverFolderPath, { recursive: true });

  const axios = getAxios();

  try {
    // request release
    const { data: release } = await axios.get<IRelease>(
      `${process.env.API_URL}/files/servers/${serverId}/releases/latest`,
      {
        responseType: 'json',
      }
    );
    // limit number of request at time during downloading
    const limit = pLimit(25);

    const downloadPromises: Promise<void | null>[] = [];

    const { files, totalSize } = release;
    // create list of requests
    Object.keys(files).forEach((path: string) => {
      const { url, size } = files[path];
      const filePath = join(serverFolderPath, dirname(path));
      const fileName = basename(path);

      if (!existsSync(filePath)) {
        mkdirSync(filePath, { recursive: true });
      }

      const promise = limit(() =>
        downloadFile(url, filePath, fileName, size, MAX_REQUEST_RETRIES)
      );
      downloadPromises.push(promise);
    });

    let prevServerFolderSize: number = 0;

    const downloadingTimer = setInterval(() => {
      const serverFolderSize = getFolderSize(serverFolderPath);
      const progress = Math.floor((serverFolderSize / totalSize) * 100);
      const downloadedSize = formatBytes(
        (serverFolderSize - prevServerFolderSize) / 2,
        1
      );

      main?.webContents.send('downloaded-size', {
        progress,
        downloadedSize,
      });
      prevServerFolderSize = serverFolderSize;
    }, 2000);

    Promise.all(downloadPromises)
      .then(() => {
        clearInterval(downloadingTimer);
        const serverFolderSize = getFolderSize(serverFolderPath);

        if (serverFolderSize === totalSize) {
          main?.webContents.send('downloaded-size', {
            progress: 100,
            downloadedSize: 0,
          });
          return main?.webContents.send(
            'downloading-log',
            'Installation completed successfully. \n'
          );
        }

        return main?.webContents.send(
          'downloading-log',
          'Something went wrong. Try again. \n'
        );
      })
      .catch((error) => {
        return main?.webContents.send('logger', {
          message: 'Error during installation',
          nativeError: error,
        });
      });
  } catch (error) {
    main?.webContents.send('logger', {
      message: 'Error during installation',
      nativeError: error,
    });
  }
});

ipcMain.handle('find-game-folder', async (_, serverName: string) => {
  const asyncStat = promisify(stat);

  const main = getMainWindow();
  const path = getAppDataPath(`${GAME_FOLDER_NAME}/${serverName}`);

  try {
    const stats = await asyncStat(path);
    return stats.isDirectory() ? path : '';
  } catch (error) {
    main?.webContents.send('logger', {
      message: 'Game folder not found, starting installation',
      nativeError: error,
      type: LauncherLogs.warning,
    });
  }
});

ipcMain.handle(
  'create-launch-command',
  async (
    _,
    {
      username,
      memoryInGigabytes,
      serverName,
      serverIp,
      isDebug,
    }: {
      username: string;
      memoryInGigabytes: number;
      serverName: string | null;
      serverIp?: string;
      isDebug: boolean;
    }
  ) => {
    return generateLaunchMinecraftCommand({
      username,
      serverName,
      memoryInGigabytes,
      serverIp,
      isDebug
    });
  }
);

ipcMain.handle(
  'verify-folders',
  async (
    _,
    {
      foldersNames,
      serverName,
      serverId,
    }: { foldersNames: string[]; serverName: string; serverId: string }
  ) => {
    const axios = getAxios();
    const main = getMainWindow();
    const serverFolder = getServerFolder(serverName);
    try {
      // request release
      const { data: release } = await axios.get<IRelease>(
        `${process.env.API_URL}/files/servers/${serverId}/releases/latest`,
        {
          responseType: 'json',
        }
      );

      const { files } = release;

      const foldersPaths = foldersNames.map((folderName: string) => {
        return join(serverFolder, folderName);
      });

      foldersPaths.forEach((folderPath: string) => {
        verifyFolder(folderPath, files, serverFolder);
      });

      await sleep(3000);

      main?.webContents.send('logger', {
        message: 'Folders passed the verification',
        type: LauncherLogs.log,
      });

      return true;
    } catch (error) {
      main?.webContents.send('logger', {
        message: 'Error during file verification',
        type: LauncherLogs.error,
        nativeError: error,
      });
    }
  }
);

ipcMain.on(
  'update-launch-options',
  (
    _,
    {
      key,
      value,
      serverName,
    }: {
      key: string;
      value: any;
      serverName: string;
    }
  ) => {
    const main = getMainWindow();
    const serverFolder = getServerFolder(serverName);
    const optionsPath = join(serverFolder, LAUNCH_OPTIONS_FILE);

    readFile(optionsPath, 'utf-8', (error, data) => {
      if (error) {
        return main?.webContents.send('logger', {
          message: 'Failed to update setting',
          nativeError: error,
          type: LauncherLogs.error,
        });
      }

      const regex = new RegExp(`(\r\n|\r|\n)${key}:.+`, 'g');

      const modifiedContent = data.replace(regex, `${EOL}${key}:${value}`);

      writeFile(optionsPath, modifiedContent, 'utf8', (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log(`Text replaced successfully.`);
        }
      });
    });
  }
);

ipcMain.on(
  'create-file',
  (
    _,
    {
      path = '',
      serverName,
      format,
      name,
      content,
    }: {
      path?: string;
      serverName: string;
      format: string;
      name: string;
      content: string;
    }
  ) => {
    const main = getMainWindow();

    const serverFolder = getServerFolder(serverName);
    const filePath = join(join(serverFolder, path), `${name}.${format}`);

    writeFile(filePath, content, 'utf-8', (error) => {
      if (error) {
        main?.webContents.send('logger', {
          message: 'Failed to create launch file',
          nativeError: error,
          type: LauncherLogs.error,
        });
      } else {
        main?.webContents.send('logger', {
          message: 'Launching game, be patient.',
          nativeError: error,
          type: LauncherLogs.log,
        });
      }
    });
  }
);

ipcMain.handle(
  'check-exists',
  (_, { path, serverName }: { path: string; serverName: string }): boolean => {
    const serverFolder = getServerFolder(serverName);
    const filePath = join(serverFolder, path);
    return checkFileExists(filePath);
  }
);

ipcMain.on(
  'execute-file',
  (_, { path, serverName }: { path: string; serverName: string }) => {
    const serverFolder = getServerFolder(serverName);
    const filePath = join(serverFolder, path);
    shell.openPath(filePath);
  }
);
