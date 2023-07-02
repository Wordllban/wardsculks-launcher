import { ISettings, SettingsList } from '../../../types';

export const getSystemMemory = async () => {
  const memory = await window.electron.ipcRenderer.invoke('get-os-memory');
  return memory;
};

export const saveMultipleSettingsOptions = (settings: ISettings) => {
  Object.keys(settings).forEach((key: string) => {
    window.electron.ipcRenderer.sendMessage('set-setting', [
      key,
      settings[key as SettingsList],
      true,
    ]);
  });
};
