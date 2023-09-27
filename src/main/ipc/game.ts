import { ipcMain } from 'electron';
import { join } from 'path';
import { mkdirSync, readFile, writeFile, stat } from 'fs';
import { readFile as readFileAsync } from 'fs/promises';
import { EOL } from 'os';
import { promisify } from 'util';
import { LAUNCH_OPTIONS_FILE, RELEASE_FILE_NAME } from '../../constants/files';
import { sleep } from '../util';
import {
  downloadReleaseFiles,
  generateLaunchMinecraftCommand,
  getServerFolder,
  verifyFolder,
} from './utils';
import { getMainWindow } from '../main';
import { LauncherLogs, ReleaseFileList } from '../../types';
import getAxios from '../services/axios';

interface IRelease {
  files: ReleaseFileList;
  totalSize: number;
  version: string;
}

ipcMain.on('game-install', async (_, serverInfo: string[]) => {
  const main = getMainWindow();
  const [serverId, serverName] = serverInfo;
  const serverFolderPath = getServerFolder(serverName);

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

    // save release.json locally
    // todo: create utility function wrapper for writeFile
    writeFile(
      join(serverFolderPath, RELEASE_FILE_NAME),
      JSON.stringify(release, null, 2),
      'utf-8',
      (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log(`Release saved successfully.`);
        }
      }
    );

    const { files, totalSize } = release;

    await downloadReleaseFiles(files, serverFolderPath, totalSize);
  } catch (error) {
    main?.webContents.send('logger', {
      type: LauncherLogs.error,
      key: 'ERROR_DURING_INSTALLATION',
      nativeError: (error as Error).message,
    });
  }
});

ipcMain.handle(
  'verify-folders',
  async (
    _,
    {
      foldersNames,
      serverName,
      serverId,
      isUpToDateRelease,
    }: {
      foldersNames: string[];
      serverName: string;
      serverId: string;
      isUpToDateRelease: boolean;
    }
  ) => {
    const axios = getAxios();
    const main = getMainWindow();
    const serverFolder = getServerFolder(serverName);
    try {
      main?.webContents.send(
        'downloading-log',
        'Verifying files integration... \n'
      );

      let localRelease: IRelease;

      if (isUpToDateRelease) {
        const releasePath = join(
          getServerFolder(serverName),
          RELEASE_FILE_NAME
        );
        localRelease = JSON.parse(await readFileAsync(releasePath, 'utf-8'));
      } else {
        // request release
        const { data } = await axios.get(
          `${process.env.API_URL}/files/servers/${serverId}/releases/latest`,
          {
            responseType: 'json',
          }
        );
        localRelease = JSON.parse(data);
      }

      const { files, totalSize } = localRelease;

      const foldersPaths = foldersNames.map((folderName: string) => {
        return join(serverFolder, folderName);
      });

      let filesToReinstall = {};

      await Promise.all(
        foldersPaths.map(async (folderPath) => {
          const damagedFiles = await verifyFolder(
            folderPath,
            files,
            serverFolder
          );
          filesToReinstall = { ...filesToReinstall, ...damagedFiles };
        })
      );

      if (Object.keys(filesToReinstall).length) {
        main?.webContents.send('logger', {
          key: 'SOME_FILES_WAS_BROKEN',
          type: LauncherLogs.warning,
        });

        await downloadReleaseFiles(
          filesToReinstall,
          serverFolder,
          totalSize,
          300
        );
      } else {
        await sleep(3000);
        main?.webContents.send('downloading-log', 'Ready to start! \n');
        main?.webContents.send('downloaded-size', {
          progress: 100,
          downloadedSize: {
            value: 0,
          },
        });
        main?.webContents.send('logger', {
          key: 'FOLDER_VERIFICATION_PASSED',
          type: LauncherLogs.log,
        });
      }

      return true;
    } catch (error) {
      main?.webContents.send('logger', {
        key: 'ERROR_DURING_FILE_VERIFICATION',
        type: LauncherLogs.error,
        nativeError: (error as Error).message,
      });
    }
  }
);

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
      serverName: string;
      serverIp?: string;
      isDebug: boolean;
    }
  ) => {
    return generateLaunchMinecraftCommand({
      username,
      serverName,
      memoryInGigabytes,
      serverIp,
      isDebug,
    });
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

ipcMain.handle('find-game-folder', async (_, serverName: string) => {
  const asyncStat = promisify(stat);

  const main = getMainWindow();
  const path = getServerFolder(serverName);

  try {
    const stats = await asyncStat(path);
    return stats.isDirectory() ? path : '';
  } catch (error) {
    main?.webContents.send('logger', {
      key: 'GAME_FOLDER_NOT_FOUND',
      nativeError: (error as Error).message,
      type: LauncherLogs.warning,
    });
  }
});
