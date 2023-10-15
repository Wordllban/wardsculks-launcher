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

export const getJavaSeverInfo = async (): Promise<any> => {
  const info = await fetch(
    'https://api.mcstatus.io/v2/status/java/mc.wardsculks.me'
  ).then((response) => response.json());

  return info;
};
