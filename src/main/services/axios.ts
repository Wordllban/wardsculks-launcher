import axios, { AxiosInstance } from 'axios';
import https from 'https';
import http from 'http';

let instance: AxiosInstance;
export default () => {
  if (!instance) {
    instance = axios.create({
      httpsAgent: new https.Agent({
        timeout: 2000,
        keepAlive: true,
        maxSockets: 25,
        // keepAliveMsecs: 60000,
        // maxFreeSockets: 50,
      }),
      httpAgent: new http.Agent({
        timeout: 2000,
        keepAlive: true,
        maxSockets: 25,
        // keepAliveMsecs: 60000,
        // maxFreeSockets: 50,
      }),
    });
    return instance;
  }

  return instance;
};
