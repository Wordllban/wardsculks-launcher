export enum LauncherLogs {
  'error' = 'error',
  'log' = 'log',
  'warning' = 'warning',
}

export type LauncherLogsTypes =
  | LauncherLogs.error
  | LauncherLogs.log
  | LauncherLogs.warning;

/**
 * You should pass `message` or `key` at one time.
 */
export interface ILauncherLog {
  id: number;
  message?: string;
  // translation key
  key?: string;
  type: LauncherLogsTypes;
  nativeError?: any;
}
