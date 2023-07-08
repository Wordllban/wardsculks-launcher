import { IServer } from '../../types/IServer';
import client from '../client.service';

export interface IRetrieveServersResponse extends IServer {}

export const retrieveServers = async (): Promise<IServer[]> => {
  const { data } = await client.get<IRetrieveServersResponse[]>(
    '/files/available-servers'
  );
  return data;
};
