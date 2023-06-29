import { ipcMain } from 'electron';
import { valueToReplace, replaceTo } from '../../constants/settings';
import store from '../../services/store.service';

/**
 * IPC handlers related to store user settings
 */

ipcMain.handle('get-setting', (_, args: [string]) => {
  const [key] = args;

  const value = store.get(key);

  return value;
});

ipcMain.on('set-setting', (_, args: [string, unknown, boolean]) => {
  const [key, value, replace] = args;

  store.set(replace ? key.replaceAll(valueToReplace, replaceTo) : key, value);
});

ipcMain.handle('get-all-settings', () => {
  const settings = store.getAll();
  return settings;
});

ipcMain.handle('has-setting', (_, args: [string]) => {
  const [key] = args;
  return store.has(key);
});
