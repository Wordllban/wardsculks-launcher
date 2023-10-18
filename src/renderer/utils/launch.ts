import { sleep } from '../../utils';
import { ISettings } from '../../types';

const launchBat = 'launch.bat';

export const launch = async ({
  serverName,
  serverIp,
  username,
}: {
  serverName: string;
  serverIp: string;
  username: string;
}): Promise<void> => {
  const { memoryUsage, autoJoin, isDebug }: ISettings =
    await window.electron.ipcRenderer.invoke('get-all-settings');

  if (isDebug.value) {
    const commandString = await window.electron.ipcRenderer.invoke(
      'create-launch-command',
      {
        username,
        serverName,
        memoryInGigabytes: memoryUsage.value,
        ...(autoJoin.value ? { serverIp } : {}),
        isDebug: isDebug.value,
      }
    );

    await window.electron.ipcRenderer.invoke('create-file', {
      serverName,
      format: 'bat',
      name: 'launch',
      content: commandString,
    });

    await window.electron.ipcRenderer.invoke('execute-file', {
      serverName,
      filePath: launchBat,
    });

    // we need some time before file execution
    await sleep(5000);

    await window.electron.ipcRenderer.invoke('delete-file', {
      serverName,
      filePath: launchBat,
    });
  } else {
    await window.electron.ipcRenderer.invoke('launch-game', {
      serverName,
      serverIp,
      username,
    });
  }
};
