/**
 *
 * `maxMemoryUsage` - number, maximum memory that can be used by Minecraft
 *
 * `-Dorg.lwjgl.opengl.Window.undecorated` - boolean, open in fullscreen
 *
 * `--server` - ip:port, if this value not empty, on opening, Minecraft
 *  will join to server automatically
 */

export enum SettingsList {
  maxMemoryUsage = 'memoryUsage',
  isFullScreen = 'fullscreen',
  isAutoJoin = 'autoJoin',
  isDebug = 'isDebug',
  closeOnGameStart = 'closeOnGameStart',
}

export enum SETTINGS_TYPE {
  GAME = 'GAME',
  LAUNCH = 'LAUNCH',
}

export interface ISettings {
  /**
   * LAUNCH SETTINGS
   */
  [SettingsList.maxMemoryUsage]: {
    value: number;
    type: SETTINGS_TYPE.LAUNCH;
  };
  [SettingsList.isAutoJoin]: {
    value: boolean;
    type: SETTINGS_TYPE.LAUNCH;
  };
  [SettingsList.isDebug]: {
    value: boolean;
    type: SETTINGS_TYPE.LAUNCH;
  };
  [SettingsList.closeOnGameStart]: {
    value: boolean;
    type: SETTINGS_TYPE.LAUNCH;
  };
  /**
   * GAME SETTINGS
   */
  [SettingsList.isFullScreen]: {
    value: boolean;
    type: SETTINGS_TYPE.GAME;
  };
}
