import { setPassword, deletePassword, getPassword } from 'keytar';
import { ipcMain } from 'electron';
import { userInfo } from 'os';

const REFRESH_TOKEN = 'wardsculks-refresh';
const ACCESS_TOKEN = 'wardsculks-access';
const ACCOUNT_NAME = userInfo().username;

ipcMain.on('save-refresh-token', async (_, args) => {
  const refreshToken = args[0];

  await setPassword(REFRESH_TOKEN, ACCOUNT_NAME, refreshToken);
});

ipcMain.on('save-access-token', async (_, args) => {
  const accessToken = args[0];

  await setPassword(ACCESS_TOKEN, ACCOUNT_NAME, accessToken);
});

ipcMain.on('logout', () => {
  deletePassword(ACCESS_TOKEN, ACCOUNT_NAME);
  deletePassword(REFRESH_TOKEN, ACCOUNT_NAME);
});

ipcMain.handle('get-access-token', () =>
  getPassword(ACCESS_TOKEN, ACCOUNT_NAME)
);

ipcMain.handle('get-refresh-token', () =>
  getPassword(REFRESH_TOKEN, ACCOUNT_NAME)
);
