export interface IFileInformation {
  url: string;
  size: number;
  hash: string;
}

/**
 * `key` - file location path
 */
export type ReleaseFileList = Record<string, IFileInformation>;

export enum RELEASE_ENGINES {
  FABRIC = 'FABRIC',
  FORGE = 'FORGE',
}

export type ReleaseEngineType = RELEASE_ENGINES.FABRIC | RELEASE_ENGINES.FORGE;
export interface IRelease {
  files: ReleaseFileList;
  totalSize: number;
  version: string;
  engine: ReleaseEngineType;
}
