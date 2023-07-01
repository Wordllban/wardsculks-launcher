import { IServer } from 'renderer/types/IServer';
import client from '../client.service';

export interface IRetrieveServersResponse {
  id: number;
  title: string;
  name: string;
  immutable_folders: string[]; // python moment
}

export const retrieveServers = async (): Promise<IServer[]> => {
  const { data } = await client.get<IRetrieveServersResponse[]>(
    '/files/available-servers'
  );
  return data.map(
    ({ id, title, name, immutable_folders }: IRetrieveServersResponse) => ({
      id,
      title,
      name,
      immutableFolders: immutable_folders,
    })
  );
};
