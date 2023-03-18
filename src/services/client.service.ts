import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

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
  private client = axios.create({
    baseURL: window.env.API_URL,
  });

  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.get(url, config);
  }

  async put<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put(url, config);
  }

  async post<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post(url, config);
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.delete(url, config);
  }
}

const client = new ClientService();

export default client;
