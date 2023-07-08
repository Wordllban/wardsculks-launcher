// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  MenuChannels,
  StoreChannels,
  OsChannels,
  AuthChannels,
  FilesChannels,
} from './ipc/types';

export type Channels =
  | AuthChannels
  | FilesChannels
  | OsChannels
  | StoreChannels
  | MenuChannels;

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, args?: unknown) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (args?: any) => void) {
      ipcRenderer.removeAllListeners(channel);

      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (args?: any) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channels, args?: unknown) {
      return ipcRenderer.invoke(channel, args);
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
