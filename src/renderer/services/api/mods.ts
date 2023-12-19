import { IMod } from 'renderer/types';
import client from '../client.service';

export interface IRequestAllModsResponse extends IMod {}

export const getAllMods = (serverId: number) => {
  return client.get<IRequestAllModsResponse[]>(
    `/files/servers/${serverId}/optional-files`
  );
};

export const getSelectedMods = (serverId: number) => {
  return client.get<number[]>(
    `/files/servers/${serverId}/optional-files/selected/ids`
  );
};

export const saveSelectedMods = (selectedFilesIds: number[]) => {
  return client.post<void>('/files/optional-files/select', {
    selectedFilesIds,
  });
};
