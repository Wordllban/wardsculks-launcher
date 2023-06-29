import { totalmem } from 'os';
import { ipcMain } from 'electron';
import { machineIdSync } from 'node-machine-id';

/**
 * IPC handlers related to operation system
 */

ipcMain.handle('get-os-memory', () => {
  const value = totalmem();
  return value;
});

ipcMain.handle('get-machine-id', () => {
  const machineId = machineIdSync();
  return machineId;
});
