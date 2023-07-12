import { ISettings } from '../types';

export const launch = async ({
  serverName,
  serverIp,
  username,
}: {
  serverName: string;
  serverIp: string;
  username: string;
}): Promise<void> => {
  // get maximum memory usage from settings
  const { memoryUsage, autoJoin }: ISettings =
    await window.electron.ipcRenderer.invoke('get-all-settings');

  const commandString = await window.electron.ipcRenderer.invoke(
    'create-launch-command',
    {
      username,
      serverName,
      memoryInGigabytes: memoryUsage,
      ...(autoJoin ? { serverIp } : {}),
      isDebug: true,
    }
  );

  await window.electron.ipcRenderer.sendMessage('create-file', {
    serverName,
    format: 'bat',
    name: 'launch',
    content: commandString,
  });

  window.electron.ipcRenderer.sendMessage('execute-file', {
    path: 'launch.bat',
    serverName,
  });
};
