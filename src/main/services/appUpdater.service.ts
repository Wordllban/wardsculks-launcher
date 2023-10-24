import { autoUpdater } from 'electron-updater';
import { BrowserWindow } from 'electron';
import { sleep } from '../../utils';
import { LauncherLogs } from '../../types';

/**
 * App auto-updater service. Use it only inside `main` process.
 */
export default class AppUpdater {
  constructor(main: BrowserWindow) {
    /**
     * HELPERS
     */
    const handleLoading = (value: boolean) => {
      main.webContents.send('app-update-downloading', value);
    };

    /**
     * SETTINGS
     */
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.autoRunAppAfterInstall = true;

    /**
     * EVENTS
     */
    autoUpdater.on('error', (error) => {
      main.webContents.send('logger', {
        key: 'ERROR_DURING_APP_UPDATE',
        nativeError: JSON.stringify(error),
        type: LauncherLogs.error,
      });
      handleLoading(false);
    });

    autoUpdater.on('checking-for-update', () => {
      main.webContents.send('logger', {
        key: 'CHECKING_FOR_APP_UPDATE',
        type: LauncherLogs.log,
      });
      handleLoading(true);
    });

    autoUpdater.on('update-available', () => {
      main.webContents.send('logger', {
        key: 'APP_UPDATE_AVAILABLE',
        type: LauncherLogs.log,
      });
      handleLoading(true);
    });

    autoUpdater.on('update-not-available', () => {
      handleLoading(false);
    });

    autoUpdater.on('update-downloaded', async () => {
      main.webContents.send('logger', {
        key: 'APP_UPDATE_DOWNLOADED_RESTART',
        type: LauncherLogs.log,
      });
      await sleep(3000);
      autoUpdater.quitAndInstall();
    });

    autoUpdater.checkForUpdatesAndNotify();
  }
}
