import { ipcMain, BrowserWindow, shell } from 'electron';
import { join } from 'path';
import {
  readFile as readFileAsync,
  writeFile as writeFileAsync,
  unlink as unlinkAsync,
} from 'fs/promises';
import { RELEASE_FILE_NAME } from '../../constants/files';
import MenuBuilder from '../menu';
import {
  checkFileExists,
  getServerFolder,
  requestServerRelease,
  saveReleaseFile,
} from './utils';
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

ipcMain.handle(
  'create-file',
  async (
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

    await writeFileAsync(filePath, content, 'utf-8').catch((error) => {
      if (error) {
        main?.webContents.send('logger', {
          message: 'Failed to create file',
          nativeError: JSON.stringify(error),
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

ipcMain.handle(
  'execute-file',
  async (
    _,
    { filePath, serverName }: { filePath: string; serverName: string }
  ) => {
    const serverFolder = getServerFolder(serverName);
    const path = join(serverFolder, filePath);
    return shell.openPath(path);
  }
);

ipcMain.handle(
  'get-local-release-version',
  async (
    _,
    { serverName, serverId }: { serverName: string; serverId: string }
  ) => {
    const serverFolderPath = getServerFolder(serverName);
    const releasePath = join(serverFolderPath, RELEASE_FILE_NAME);

    const isReleaseFileExists = checkFileExists(releasePath);

    if (isReleaseFileExists) {
      const release = JSON.parse(await readFileAsync(releasePath, 'utf-8'));
      return release.version;
    }
    const release = await requestServerRelease(serverId);
    await saveReleaseFile(serverFolderPath, release);
    return release.version;
  }
);

ipcMain.handle('delete-file', async (_, { serverName, filePath }) => {
  const serverFolder = getServerFolder(serverName);
  const path = join(serverFolder, filePath);

  const isExists = checkFileExists(path);

  if (isExists) {
    return unlinkAsync(path);
  }
});
