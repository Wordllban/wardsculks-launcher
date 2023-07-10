export enum LauncherLogs {
  'error' = 'error',
  'log' = 'log',
  'warning' = 'warning',
}

export type LauncherLogsTypes =
  | LauncherLogs.error
  | LauncherLogs.log
  | LauncherLogs.warning;

export interface ILauncherLog {
  id: string;
  message: string;
  type: LauncherLogsTypes;
  nativeError?: unknown;
}
