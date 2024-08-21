import { ipcMain, app } from 'electron';
import { join, resolve } from 'path';
import { mkdirSync, readFile, writeFile, stat } from 'fs';
import { readFile as readFileAsync } from 'fs/promises';
import { EOL } from 'os';
import { promisify } from 'util';
import { spawn } from 'child_process';
import { AxiosError } from 'axios';
import { store } from '../services';
import {
  requestOptionalFilesInfo,
  requestServerRelease,
} from '../services/api';
import { LAUNCH_OPTIONS_FILE, RELEASE_FILE_NAME } from '../../constants/files';
import { sleep } from '../../utils';
import {
  downloadReleaseFiles,
  generateLaunchMinecraftCommandFabric,
  generateLaunchMinecraftCommandForge,
  getReleaseFile,
  getServerFolder,
  saveReleaseFile,
  verifyFolder,
} from './utils';
import { getMainWindow } from '../main';
import { IRelease, LauncherLogs, RELEASE_ENGINES } from '../../types';

ipcMain.on('game-install', async (_, serverInfo: [number, string]) => {
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
      nativeError: JSON.stringify(error),
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
      serverId: number;
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

      // request selected optional files and add into release for verification
      const optionalFiles = await requestOptionalFilesInfo(serverId);
      localRelease = {
        ...localRelease,
        files: { ...localRelease.files, ...optionalFiles },
      };

      const { files, totalSize } = localRelease;

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
        nativeError:
          (error as AxiosError).response?.data || JSON.stringify(error),
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
    return generateLaunchMinecraftCommandFabric({
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
          nativeError: JSON.stringify(error),
          type: LauncherLogs.error,
        });
      }

      const regex = new RegExp(`${EOL}${key}:.+`, 'g');

      const modifiedContent = data.replace(regex, `${EOL}${key}:${value}`);

      writeFile(optionsPath, modifiedContent, 'utf8', (err) => {
        if (err) {
          return main?.webContents.send('logger', {
            message: 'Failed to update setting',
            nativeError: JSON.stringify(error),
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
    const main = getMainWindow();
    try {
      const { memoryUsage, autoJoin, isDebug, closeOnGameStart } =
        store.getAll();

      const release = await getReleaseFile(serverName);
      const releaseEngine = release.engine;

      let launchCommand: string;

      switch (releaseEngine) {
        case RELEASE_ENGINES.FABRIC:
          launchCommand = await generateLaunchMinecraftCommandFabric({
            username,
            serverName,
            memoryInGigabytes: memoryUsage.value,
            ...(autoJoin.value ? { serverIp } : {}),
            isDebug: isDebug.value,
          });
          break;

        case RELEASE_ENGINES.FORGE:
          launchCommand = await generateLaunchMinecraftCommandForge({
            username,
            serverName,
            memoryInGigabytes: memoryUsage.value,
            ...(autoJoin.value ? { serverIp } : {}),
            isDebug: isDebug.value,
          });
          break;

        default:
          main?.webContents.send('logger', {
            key: 'GAME_FOLDER_NOT_FOUND',
            type: LauncherLogs.warning,
          });
          return;
      }

      const serverFolder = getServerFolder(serverName);

      const args =
        launchCommand
          .match(/"[^"]+"|\S+/g)
          ?.map((arg: string) => arg.replace(/^"(.*)"$/, '$1')) || [];

      const gameProcess = spawn(args[4], args.slice(5), {
        detached: true,
        cwd: serverFolder,
        stdio: 'inherit',
      });
      gameProcess.unref();

      if (process.env.NODE_ENV === 'production') {
        // only for production
        // need to replace path for development
        const discordPresencePath = resolve(
          app.getAppPath().replace('app.asar', 'app.asar.unpacked'),
          'dist',
          'scripts',
          'discordPresence.js'
        );

        const discordPresence = spawn(
          process.execPath,
          [discordPresencePath, '--gamepid', `${gameProcess.pid}`],
          {
            detached: true,
            env: {
              ...process.env,
              ELECTRON_RUN_AS_NODE: '1',
            },
          }
        );
        discordPresence.unref();

        // kill presence process on game close
        // note: works only if electron app not closed
        gameProcess.on('exit', () => {
          discordPresence.kill();
        });
      }

      if (closeOnGameStart.value) {
        await sleep(3000);
        main?.webContents.send('logger', {
          key: 'APP_WILL_AUTOMATICALLY_CLOSE',
          type: LauncherLogs.log,
        });
        await sleep(5000);

        app.quit();
      }
    } catch (error) {
      main?.webContents.send('logger', {
        key: 'FAILED_TO_LAUNCH_GAME',
        type: LauncherLogs.error,
        nativeError: JSON.stringify(error),
      });
    }
  }
);
