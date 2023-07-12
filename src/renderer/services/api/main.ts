import { IServer } from '../../types/IServer';
import client from '../client.service';

export interface IRequestServersResponse extends IServer {}

export const getAvailableServers = async (): Promise<
  IRequestServersResponse[]
> => {
  const { data } = await client.get<IRequestServersResponse[]>(
    '/files/available-servers'
  );
  return data;
};
