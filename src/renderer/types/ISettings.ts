/**
 * `isInitial` - boolean, if initial key doesn't exists in config,
 *  it's first time user opens app
 *
 * `-Xmx` - number, maximum memory that can be used by Minecraft
 *
 * `-Dorg.lwjgl.opengl.Window.undecorated` - boolean, open in fullscreen
 *
 * `--server` - ip:port, if this value not empty, on opening, Minecraft
 *  will join to server automatically
 */

export enum SettingsList {
  isInitial = 'isInitial',
  maxMemoryUsage = '-Xmx',
  isFullScreen = 'fullscreen',
  isAutoJoin = 'autoJoin',
}

export interface ISettings {
  [SettingsList.isInitial]: boolean;
  [SettingsList.maxMemoryUsage]: number;
  [SettingsList.isFullScreen]: boolean;
  [SettingsList.isAutoJoin]: boolean;
}
