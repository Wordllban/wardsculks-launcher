export interface IFileInformation {
  url: string;
  size: number;
  hash: string;
}

/**
 * `key` - file location path
 */
export type ReleaseFileList = Record<string, IFileInformation>;
