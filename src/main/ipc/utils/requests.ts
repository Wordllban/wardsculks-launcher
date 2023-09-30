import { IRelease } from '../../../types';
import getAxios from '../../services/axios';

export const requestServerRelease = async (
  serverId: string
): Promise<IRelease> => {
  const axios = getAxios();
  const { data } = await axios.get<IRelease>(
    `${process.env.API_URL}/files/servers/${serverId}/releases/latest`,
    {
      responseType: 'json',
    }
  );
  return data;
};
