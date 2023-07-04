import { ipcMain } from 'electron';
import { getMainWindow } from '../main';

/**
 * IPC handlers related to custom menu
 */

ipcMain.handle('min-max-window', () => {
  const window = getMainWindow();

  const isMaximized = window?.isMaximized();

  if (!isMaximized) {
    window?.maximize();
  } else {
    window?.restore();
  }

  return !isMaximized;
});

ipcMain.on('close-window', () => {
  const window = getMainWindow();

  window?.close();
});

ipcMain.on('minimize-window', () => {
  const window = getMainWindow();
  window?.minimize();
});
