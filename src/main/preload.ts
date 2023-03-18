// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'save-access-token'
  | 'save-refresh-token'
  | 'get-access-token'
  | 'get-refresh-token'
  | 'logout';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, args?: unknown) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
export type ElectronHandler = typeof electronHandler;

const envHandler = {
  API_URL: process.env.API_URL,
};

contextBridge.exposeInMainWorld('env', envHandler);
export type EnvHandler = typeof envHandler;

const tokensHandler = {
  getAccessToken: () =>
    ipcRenderer.invoke('get-access-token').then((result) => result),
  getRefreshToken: () =>
    ipcRenderer.invoke('get-refresh-token').then((result) => result),
};

contextBridge.exposeInMainWorld('tokens', tokensHandler);
export type TokensHandler = typeof tokensHandler;
