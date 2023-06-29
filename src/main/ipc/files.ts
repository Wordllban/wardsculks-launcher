import { ipcMain, BrowserWindow } from 'electron';
import { dirname, basename, join } from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import pLimit from 'p-limit';
import { GAME_FOLDER_NAME } from '../../constants/files';
import MenuBuilder from '../menu';
import { resolveFilesURL, resolveFilesPath } from '../util';
import { downloadFile } from './utils';
import { getMainWindow } from '../main';

/**
 * IPC handlers related to file system
 */

interface IFileInformation {
  url: string;
  size: number;
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

// TODO: provide json with list of items to be installed
ipcMain.on('game-install', async () => {
  // limit number of request at time during downloading
  const limit = pLimit(25);
  const downloadPromises: Promise<void | null>[] = [];

  const jsonPath = resolveFilesPath('files.json');

  // request installation list
  const file: Record<string, IFileInformation> = JSON.parse(
    readFileSync(jsonPath, 'utf-8')
  );

  // create list of requests
  Object.keys(file).forEach((path: string) => {
    const { url, size } = file[path];
    const filePath = join(GAME_FOLDER_NAME, dirname(path));
    const fileName = basename(path);

    if (!existsSync(filePath)) {
      mkdirSync(filePath, { recursive: true });
    }

    const promise = limit(() => downloadFile(url, filePath, fileName, size));
    downloadPromises.push(promise);
  });

  const main = getMainWindow();

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
});
