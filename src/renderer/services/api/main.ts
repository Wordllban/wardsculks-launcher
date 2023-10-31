import { SERVER_STATUS_API_URL } from 'constants/files';
import { IServer, IServerInfo } from '../../types/IServer';
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

export interface IRequestJavaServerInfoResponse extends IServerInfo {}

export const getJavaSeverInfo = async (): Promise<IServerInfo> => {
  const info = await fetch(SERVER_STATUS_API_URL).then((response) =>
    response.json()
  );

  return info;
};
