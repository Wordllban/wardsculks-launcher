import { ElectronHandler, EnvHandler } from 'main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    env: EnvHandler;
  }
}

export {};
