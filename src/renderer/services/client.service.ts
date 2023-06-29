import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Service provides basic `http` requests with auth tokens using axios.
 * Can be imported only in renderer.
 * @method `get`
 *
 * @method `put`
 *
 * @method `post`
 *
 * @method `delete`
 */
class ClientService {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: window.env.API_URL,
    });
    this.client.interceptors.request.use(async (config) => {
      const token = await window.electron.ipcRenderer.invoke(
        'get-access-token'
      );

      if (token) config.headers.Authorization = `Bearer ${token}`;

      return config;
    });
  }

  async get<Response>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Response>> {
    return this.client.get(url, config);
  }

  async put<Response, Data>(
    url: string,
    data?: Data
  ): Promise<AxiosResponse<Response>> {
    return this.client.put(url, data);
  }

  async post<Response, Data>(
    url: string,
    data?: Data
  ): Promise<AxiosResponse<Response>> {
    return this.client.post(url, data);
  }

  async delete<Response, Config>(
    url: string,
    config?: AxiosRequestConfig<Config>
  ): Promise<AxiosResponse<Response>> {
    return this.client.delete(url, config);
  }
}

const client = new ClientService();

export default client;
