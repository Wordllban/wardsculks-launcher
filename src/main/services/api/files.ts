import { ReleaseFileList, IRelease } from '../../../types';
import { client } from '..';

export const requestServerRelease = async (
  serverId: number
): Promise<IRelease> => {
  const { data } = await client.instance.get<IRelease>(
    `${process.env.API_URL}/files/servers/${serverId}/releases/latest`,
    {
      responseType: 'json',
    }
  );
  return data;
};

export const requestOptionalFilesInfo = async (
  serverId: number
): Promise<ReleaseFileList> => {
  const { data } = await client.instance.get<ReleaseFileList>(
    `${process.env.API_URL}/files/servers/${serverId}/optional-files/selected/download-info`
  );

  return data;
};
