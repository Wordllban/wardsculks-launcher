/**
 * `isInitial` - boolean, if initial key doesn't exists in config,
 *  it's first time user opens app
 *
 * `maxMemoryUsage` - number, maximum memory that can be used by Minecraft
 *
 * `-Dorg.lwjgl.opengl.Window.undecorated` - boolean, open in fullscreen
 *
 * `--server` - ip:port, if this value not empty, on opening, Minecraft
 *  will join to server automatically
 */

export enum SettingsList {
  isInitial = 'isInitial',
  maxMemoryUsage = 'memoryUsage',
  isFullScreen = 'fullscreen',
  isAutoJoin = 'autoJoin',
  isDebug = 'isDebug',
}

export enum SETTINGS_TYPE {
  GAME = 'GAME',
  LAUNCH = 'LAUNCH',
}

export interface ISettings {
  [SettingsList.isInitial]: {
    value: boolean;
    type: SETTINGS_TYPE.LAUNCH;
  };
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
  /**
   * GAME SETTINGS
   */
  [SettingsList.isFullScreen]: {
    value: boolean;
    type: SETTINGS_TYPE.GAME;
  };
}
