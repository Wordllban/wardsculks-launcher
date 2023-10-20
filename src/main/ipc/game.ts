import { ipcMain } from 'electron';
import { join } from 'path';
import { mkdirSync, readFile, /* appendFile, */ writeFile, stat } from 'fs';
import { readFile as readFileAsync } from 'fs/promises';
import { EOL } from 'os';
import { promisify } from 'util';
import { spawn } from 'child_process';
import { store } from '../services';
import { LAUNCH_OPTIONS_FILE, RELEASE_FILE_NAME } from '../../constants/files';
import { sleep } from '../../utils';
import {
  downloadReleaseFiles,
  generateLaunchMinecraftCommand,
  getServerFolder,
  requestServerRelease,
  saveReleaseFile,
  verifyFolder,
} from './utils';
import { getMainWindow } from '../main';
import { IRelease, LauncherLogs } from '../../types';

ipcMain.on('game-install', async (_, serverInfo: string[]) => {
  const main = getMainWindow();
  const [serverId, serverName] = serverInfo;
  const serverFolderPath = getServerFolder(serverName);

  // create game folder
  mkdirSync(serverFolderPath, { recursive: true });

  try {
    // request release
    const release = await requestServerRelease(serverId);

    // save release.json locally
    await saveReleaseFile(serverFolderPath, release);

    const { files, totalSize } = release;

    await downloadReleaseFiles(files, serverFolderPath, totalSize).then(() => {
      return main?.webContents.send('downloaded-size', {
        progress: 100,
        downloadedSize: {
          value: 0,
        },
        firstTimeDownloading: true,
      });
    });
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
      immutableFolders,
      serverName,
      serverId,
      isUpToDateRelease,
    }: {
      immutableFolders: string[];
      serverName: string;
      serverId: string;
      isUpToDateRelease: boolean;
    }
  ) => {
    const main = getMainWindow();
    const serverFolder = getServerFolder(serverName);

    const finishedMessage = () => {
      main?.webContents.send('downloaded-size', {
        progress: 100,
        downloadedSize: {
          value: 0,
        },
        firstTimeDownloading: false,
      });
    };

    try {
      main?.webContents.send(
        'downloading-log',
        'Verifying files integration... \n'
      );

      let localRelease: IRelease;

      // request release if it is outdated
      if (isUpToDateRelease) {
        const releasePath = join(
          getServerFolder(serverName),
          RELEASE_FILE_NAME
        );
        localRelease = JSON.parse(await readFileAsync(releasePath, 'utf-8'));
      } else {
        localRelease = await requestServerRelease(serverId);
      }

      const { files, totalSize } = localRelease;

      /* const foldersPaths = isUpToDateRelease
      ? foldersNames.map((folderName: string) => {
        return join(serverFolder, folderName);
      })
      : [serverFolder]; */
      // for new releases we verifying whole game
      const foldersPaths = [serverFolder];

      const [filesToReinstall] = await Promise.all(
        foldersPaths.map(async (folderPath) => {
          return verifyFolder(
            folderPath,
            files,
            serverFolder,
            immutableFolders
          );
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
          500
        );

        finishedMessage();
        return true;
      }
      await sleep(3000);
      main?.webContents.send('downloading-log', 'Ready to start! \n');
      main?.webContents.send('logger', {
        key: 'FOLDER_VERIFICATION_PASSED',
        type: LauncherLogs.log,
      });

      finishedMessage();
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

      const regex = new RegExp(`${EOL}${key}:.+`, 'g');

      const modifiedContent = data.replace(regex, `${EOL}${key}:${value}`);

      writeFile(optionsPath, modifiedContent, 'utf8', (err) => {
        if (err) {
          return main?.webContents.send('logger', {
            message: 'Failed to update setting',
            nativeError: err,
            type: LauncherLogs.error,
          });
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

ipcMain.handle(
  'launch-game',
  async (
    _,
    {
      username,
      serverName,
      serverIp,
    }: {
      username: string;
      serverName: string;
      serverIp?: string;
    }
  ) => {
    // const main = getMainWindow();
    // isDebug is not in use right now, due to Forge issues
    // todo: make debug to start game with console
    const { memoryUsage, autoJoin, isDebug } = store.getAll();

    const command = await generateLaunchMinecraftCommand({
      username,
      serverName,
      memoryInGigabytes: memoryUsage.value,
      ...(autoJoin.value ? { serverIp } : {}),
      isDebug: isDebug.value,
    });

    const serverFolder = getServerFolder(serverName);
    const args = command
      .split(' ')
      // remove empty arguments
      .filter((arg) => arg.length > 0)
      .map((arg) => {
        return arg.replaceAll('"', '').trim();
      });

    const gameProcess = spawn(args[2], args.slice(3), {
      detached: true,
      cwd: serverFolder,
      stdio: 'inherit',
    });

    /*     if (isDebug.value) {
      const debugFilePath = join(serverFolder, 'debugger.txt');
      // clear previous debug file, or create if it not exists
      writeFile(debugFilePath, '', (error) => {
        if (error) {
          main?.webContents.send('logger', {
            key: 'FAILED_TO_CREATE_DEBUG_FILE',
            nativeError: error,
            type: LauncherLogs.error,
          });
        }
      });

      gameProcess.stdout?.on('data', (data) => {
        appendFile(debugFilePath, data.toString() + EOL, (error) => {
          if (error) {
            main?.webContents.send('logger', {
              key: 'FAILED_TO_CREATE_DEBUG_FILE',
              nativeError: error,
              type: LauncherLogs.error,
            });
          }
        });
      });
    } */

    gameProcess.unref();
  }
);
