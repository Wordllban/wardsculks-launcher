import { ipcMain, BrowserWindow, shell } from 'electron';
import { join } from 'path';
import { writeFile } from 'fs';
import { readFile as readFileAsync } from 'fs/promises';
import { RELEASE_FILE_NAME } from '../../constants/files';
import MenuBuilder from '../menu';
import { checkFileExists, getServerFolder } from './utils';
import { getMainWindow } from '../main';
import { LauncherLogs } from '../../types';

/**
 * IPC handlers related to file system
 */

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
          message: 'Failed to create file',
          nativeError: error,
          type: LauncherLogs.error,
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

ipcMain.handle('get-local-release-version', async (_, serverName: string) => {
  const releasePath = join(getServerFolder(serverName), RELEASE_FILE_NAME);
  const release = JSON.parse(await readFileAsync(releasePath, 'utf-8'));
  return release.version;
});
