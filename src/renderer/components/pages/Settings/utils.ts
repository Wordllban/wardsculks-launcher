import { ISettings, SETTINGS_TYPE, SettingsList } from '../../../../types';

export const getSystemMemory = async () => {
  const memory = await window.electron.ipcRenderer.invoke('get-os-memory');
  return memory;
};

export const saveMultipleSettingsOptions = (
  settings: ISettings,
  serverName: string
) => {
  Object.keys(settings).forEach((key: string) => {
    window.electron.ipcRenderer.sendMessage('set-setting', [
      key,
      settings[key as SettingsList],
      true,
    ]);
    // game settings files changes
    if (
      settings[key as SettingsList].type === SETTINGS_TYPE.GAME &&
      serverName
    ) {
      window.electron.ipcRenderer.sendMessage('update-launch-options', {
        key,
        value: settings[key as SettingsList].value,
        serverName,
      });
    }
  });
};
