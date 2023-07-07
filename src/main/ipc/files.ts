import { ipcMain, BrowserWindow } from 'electron';
import { dirname, basename, join } from 'path';
import { existsSync, mkdirSync, stat } from 'fs';
import pLimit from 'p-limit';
import axios from 'axios';
import getAppDataPath from 'appdata-path';
import { promisify } from 'util';
import { GAME_FOLDER_NAME, MAX_REQUEST_RETRIES } from '../../constants/files';
import MenuBuilder from '../menu';
import { resolveFilesURL } from '../util';
import { downloadFile, getFolderSize } from './utils';
import { getMainWindow } from '../main';
import { formatBytes } from '../../utils';
import { IFileInformation } from '../../types';

/**
 * IPC handlers related to file system
 */

interface IRelease {
  files: Record<string, IFileInformation>;
  // totalSize: number;
  total_size: number;
}

ipcMain.on('open-file', async (_, fileName) => {
  const path = resolveFilesURL(fileName);
  const window = new BrowserWindow({
    webPreferences: {
      plugins: true,
      contextIsolation: true,
      sandbox: true,
    },
  });

  const menuBuilder = new MenuBuilder(window);
  menuBuilder.buildMenu();

  window.loadURL(path);
});

ipcMain.on('game-install', async (_, serverInfo: string[]) => {
  ipcMain.removeAllListeners();
  const main = getMainWindow();

  const [serverId, serverName] = serverInfo;
  const serverFolderPath = getAppDataPath(`${GAME_FOLDER_NAME}/${serverName}`);
  const serverFolderSize = getFolderSize(serverFolderPath);

  try {
    // request release
    const { data: release } = await axios.get<IRelease>(
      `${process.env.API_URL}/files/servers/${serverId}/releases/latest`
    );
    // limit number of request at time during downloading
    const limit = pLimit(25);

    const downloadPromises: Promise<void | null>[] = [];

    const { files, total_size } = release;

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
      main?.webContents.send('downloaded-size', {
        progress: Math.floor((serverFolderSize / total_size) * 100),
        downloadedSize: formatBytes(
          (serverFolderSize - prevServerFolderSize) / 2,
          1
        ),
      });
      prevServerFolderSize = serverFolderSize;
    }, 2000);

    Promise.all(downloadPromises)
      .then(() => {
        clearInterval(downloadingTimer);

        if (serverFolderSize === total_size) {
          return main?.webContents.send(
            'downloading-log',
            'Installation completed successfully. \n'
          );
        }

        return main?.webContents.send(
          'downloading-log',
          'Something went wrong. \n'
        );
      })
      .catch((error) =>
        main?.webContents.send('error', {
          message: 'Error during installation',
          nativeError: error,
        })
      );
  } catch (error) {
    main?.webContents.send('error', {
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
    return !!stats.isDirectory();
  } catch (error) {
    main?.webContents.send('error', {
      message: 'Game folder not found, starting installation',
      nativeError: error,
    });
  }
});
