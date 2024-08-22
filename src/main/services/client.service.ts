import axios, { AxiosInstance } from 'axios';
import https from 'https';
import http from 'http';

class ClientService {
  private client: AxiosInstance;

  /**
   * Note: we cannot use `.env` variables inside main process, because electron doesn't know about it
   */
  constructor() {
    this.client = axios.create({
      httpsAgent: new https.Agent({
        timeout: 2000,
        maxSockets: 25,
        // keepAliveMsecs: 60000,
        // maxFreeSockets: 50,
      }),
      httpAgent: new http.Agent({
        timeout: 2000,
        maxSockets: 25,
        // keepAliveMsecs: 60000,
        // maxFreeSockets: 50,
      }),
    });
  }

  async updateInterceptor(accessToken: string) {
    this.client.interceptors.request.use(async (config) => {
      config.headers.Authorization = `Bearer ${accessToken}`;

      return config;
    });
  }

  get instance() {
    return this.client;
  }
}

const client = new ClientService();

export default client;
