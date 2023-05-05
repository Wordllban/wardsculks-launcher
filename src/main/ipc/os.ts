import { totalmem } from 'os';
import { ipcMain } from 'electron';

/**
 * IPC handlers related to operation system
 */

ipcMain.handle('get-os-memory', () => {
  const value = totalmem();
  return value;
});
