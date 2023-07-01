import { ipcMain, BrowserWindow } from 'electron';
import { dirname, basename, join } from 'path';
import { existsSync, mkdirSync, stat } from 'fs';
import pLimit from 'p-limit';
import axios from 'axios';
import getAppDataPath from 'appdata-path';
import { promisify } from 'util';
import { GAME_FOLDER_NAME } from '../../constants/files';
import MenuBuilder from '../menu';
import { resolveFilesURL } from '../util';
import { downloadFile } from './utils';
import { getMainWindow } from '../main';

/**
 * IPC handlers related to file system
 */

interface IFileInformation {
  url: string;
  size: number;
  hash: string;
}

interface IRelease {
  files: Record<string, IFileInformation>;
  totalSize: number;
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

ipcMain.on('game-install', async (_, serverId: number) => {
  const main = getMainWindow();

  try {
    // request release
    const { data: release } = await axios.get<IRelease>(
      `${process.env.API_URL}/files/servers/${serverId}/releases/latest`
    );
    // limit number of request at time during downloading
    const limit = pLimit(25);

    const downloadPromises: Promise<void | null>[] = [];

    const { files } = release;

    // create list of requests
    Object.keys(files).forEach((path: string) => {
      const { url, size } = files[path];
      const filePath = join(GAME_FOLDER_NAME, dirname(path));
      const fileName = basename(path);

      if (!existsSync(filePath)) {
        mkdirSync(filePath, { recursive: true });
      }

      const promise = limit(() => downloadFile(url, filePath, fileName, size));
      downloadPromises.push(promise);
    });

    Promise.all(downloadPromises)
      .then(() =>
        main?.webContents.send(
          'downloading-log',
          'Installation completed successfully. \n'
        )
      )
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
  const path = getAppDataPath(`.wardsculks/${serverName}`);

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
