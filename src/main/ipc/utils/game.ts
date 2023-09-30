import { dirname, basename, join, sep } from 'path';
import getAppDataPath from 'appdata-path';
import { existsSync, mkdirSync, writeFile } from 'fs';
import promiseLimit from 'p-limit';
import {
  GAME_FOLDER_NAME,
  MAX_REQUEST_RETRIES,
  RELEASE_FILE_NAME,
} from '../../../constants/files';
import { downloadFile, getAllFilePaths, getFolderSize } from './files';
import { formatBytes } from '../../../utils';
import { getMainWindow } from '../../main';
import { IRelease, LauncherLogs, ReleaseFileList } from '../../../types';

export function getServerFolder(serverName: string): string {
  return getAppDataPath(`${GAME_FOLDER_NAME}/${serverName}`);
}

export async function generateLaunchMinecraftCommand({
  username,
  memoryInGigabytes,
  serverName,
  serverIp,
  isDebug,
}: {
  username: string;
  memoryInGigabytes: number;
  serverName: string;
  serverIp?: string;
  isDebug: boolean;
}): Promise<string> {
  const serverFolderPath = getServerFolder(serverName);
  const librariesFolderPath = join(serverFolderPath, 'libraries');
  const executableText = isDebug
    ? join(serverFolderPath, 'jre', 'bin', 'java.exe')
    : `start ${join(serverFolderPath, 'jre', 'bin', 'javaw.exe')}`;
  // todo: get java path for diff OS
  const librariesPaths = getAllFilePaths(librariesFolderPath);
  const librariesString = librariesPaths.reduce((accumulator, libraryPath) => {
    return `${
      accumulator +
      libraryPath
        .replace(`${serverFolderPath + sep}`, '')
        .replace(/\\[^\\]+$/, '\\*')
    };`;
  }, '');
  const librariesVariable = `-cp "${librariesString}"`;
  const memoryVariable = `-Xmx${memoryInGigabytes}G`;
  const variables = `${memoryVariable} ${librariesVariable}`;

  const immutableParameters =
    '--gameDir . --assetsDir assets --accessToken 0 --tweakClass fabric.loader.Tweaker';
  const assetIndexVersion = basename(
    getAllFilePaths(join(serverFolderPath, 'assets', 'indexes'))[0]
  ).replace('.json', '');
  const assetIndexParameter = `--assetIndex ${assetIndexVersion}`;
  const usernameParameter = `--username ${username}`;
  const autoConnectParameter = serverIp ? `--server ${serverIp}` : '';
  const parameters = `${immutableParameters} ${assetIndexParameter} ${usernameParameter} ${autoConnectParameter}`;
  return `cd ${serverFolderPath}
  ${executableText} ${variables} net.fabricmc.loader.impl.launch.knot.KnotClient ${parameters}
  ${isDebug ? 'pause' : ''}`;
}

/**
 *
 * @param serverFolderPath - path of server folder(Windows: AppData | MacOS: Application Support | Linux: user.home/appname)
 * @param totalSize - total expected size of a server folder
 * @param interval - interval in which function will send progress of installation to UI
 * @returns {NodeJS.Timer} - NodeJS.Timer to clear it after operation
 */
export const downloadingProgressSubscription = (
  serverFolderPath: string,
  totalSize: number,
  interval: number = 2000
): NodeJS.Timer => {
  const main = getMainWindow();

  let prevServerFolderSize: number = 0;

  return setInterval(() => {
    // todo: find a way to optimize this calculation
    const serverFolderSize = getFolderSize(serverFolderPath);
    const progress = Math.round((serverFolderSize / totalSize) * 100);
    const downloadedSize = formatBytes(
      (serverFolderSize - prevServerFolderSize) / 2,
      1
    );

    main?.webContents.send('downloaded-size', {
      progress,
      downloadedSize,
    });
    prevServerFolderSize = serverFolderSize;
  }, interval);
};

export async function downloadReleaseFiles(
  files: ReleaseFileList,
  serverFolderPath: string,
  totalSize: number,
  downloadingProgressInterval: number = 2000
) {
  const main = getMainWindow();
  // limit number of request at time during downloading
  const limit = promiseLimit(25);

  // create list of promises
  const filesToDownload = Object.keys(files).map((path: string) => {
    const { url, size } = files[path];
    const filePath = join(serverFolderPath, dirname(path));
    const fileName = basename(path);

    if (!existsSync(filePath)) {
      mkdirSync(filePath, { recursive: true });
    }

    const promise = limit(() =>
      downloadFile(url, filePath, fileName, size, MAX_REQUEST_RETRIES)
    );

    return promise;
  });

  const downloadingTimer = downloadingProgressSubscription(
    serverFolderPath,
    totalSize,
    downloadingProgressInterval
  );

  return Promise.all(filesToDownload).then(() => {
    clearInterval(downloadingTimer);

    const serverFolderSize = getFolderSize(serverFolderPath);

    if (serverFolderSize >= totalSize) {
      return main?.webContents.send(
        'downloading-log',
        'Installation completed successfully. \n'
      );
    }

    return main?.webContents.send(
      'downloading-log',
      'Something went wrong. Try again. \n'
    );
  });
}

export const saveReleaseFile = async (
  serverFolderPath: string,
  release: IRelease
) => {
  // todo: create utility function wrapper for writeFile
  const main = getMainWindow();
  writeFile(
    join(serverFolderPath, RELEASE_FILE_NAME),
    JSON.stringify(release, null, 2),
    'utf-8',
    (error) => {
      if (error) {
        main?.webContents.send('logger', {
          message: 'Failed to save release',
          nativeError: error,
          type: LauncherLogs.error,
        });
      }
    }
  );
};
