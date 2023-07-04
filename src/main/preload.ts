// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { MenuChannels } from './ipc/types';
// TODO: split channels type into specific files
export type Channels =
  | 'save-access-token'
  | 'save-refresh-token'
  | 'get-access-token'
  | 'get-refresh-token'
  | 'logout'
  | 'get-os-memory'
  | 'get-machine-id'
  | 'open-file'
  | 'get-setting'
  | 'set-setting'
  | 'get-all-settings'
  | 'has-setting'
  | 'find-game-folder'
  | 'game-install'
  | 'downloading-log'
  | 'error'
  | 'downloaded-size'
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
  SERVER_IP: process.env.SERVER_IP,
  SERVER_PORT: process.env.SERVER_PORT,
};

contextBridge.exposeInMainWorld('env', envHandler);
export type EnvHandler = typeof envHandler;
