import {
  createWriteStream,
  createReadStream,
  unlinkSync,
  statSync,
  readdirSync,
  constants,
  accessSync,
} from 'fs';
import { createHash } from 'crypto';
import { basename, join, sep } from 'path';
import getAppDataPath from 'appdata-path';
import { sleep } from '../../util';
import { getMainWindow } from '../../main';
import { IFileInformation, LauncherLogs } from '../../../types';
import { GAME_FOLDER_NAME } from '../../../constants/files';
import getAxios from '../../services/axios';

export async function downloadFile(
  url: string,
  filePath: string,
  fileName: string,
  fileSize: number,
  maxRetries: number = 10
): Promise<void | null> {
  const fileFullPath = join(filePath, fileName);
  const writer = createWriteStream(fileFullPath);

  const main = getMainWindow();
  const axios = getAxios();
  try {
    const response = await axios.get(url, {
      responseType: 'stream',
    });

    const responseSize = response.headers['content-length'];

    // 302 is redirect
    if (response.status === 302) {
      return downloadFile(url, filePath, fileName, fileSize);
    }

    // check response size
    if (Number(responseSize) !== Number(fileSize)) {
      return downloadFile(url, filePath, fileName, fileSize, maxRetries - 1);
    }

    await response?.data.pipe(writer);

    return new Promise<void>((resolve, reject) => {
      writer.on('finish', () => {
        main?.webContents.send(
          'downloading-log',
          `File downloaded successfully: ${fileFullPath}`
        );
        writer.close();
        resolve();
      });

      writer.on('error', (err) => {
        main?.webContents.send(
          'downloading-log',
          `Error downloading file: ${fileFullPath}`
        );
        unlinkSync(fileFullPath);
        reject(err);
      });
    });
  } catch (error) {
    if (maxRetries > 0) {
      main?.webContents.send(
        'downloading-log',
        `Request failed. Retries left: ${maxRetries}`
      );
      await sleep(2000);
      return downloadFile(url, filePath, fileName, fileSize, maxRetries - 1);
    }
    main?.webContents.send(
      'downloading-log',
      `Failed to download file: ${fileName}`
    );
  }
  return null;
}

/**
 * Create sha256 hash
 * @param {string} filePath
 * @returns {string} hash
 */
export const sha256 = async (filePath: string): Promise<string> => {
  const main = getMainWindow();
  return new Promise((resolve, reject) => {
    const read = createReadStream(filePath);
    const hash = createHash('sha256');

    read.on('data', (data) => {
      hash.update(data);
    });

    read.on('end', () => {
      const hashed = hash.digest('hex');
      resolve(hashed);
    });

    read.on('error', (error) => {
      main?.webContents.send('logger', {
        message: 'Failed to read file',
        nativeError: error,
        type: LauncherLogs.error,
      });
      reject(error);
    });
  });
};

export function getFolderSize(folderPath: string) {
  let totalSize = 0;

  function calculateFolderSize(directory: string) {
    const files = readdirSync(directory);

    files.forEach((file) => {
      const filePath = join(directory, file);
      const stats = statSync(filePath);

      if (stats.isFile()) {
        totalSize += stats.size;
      } else if (stats.isDirectory()) {
        calculateFolderSize(filePath);
      }
    });
  }

  calculateFolderSize(folderPath);

  return totalSize;
}

/**
 * Compare file hash
 * @param path - path to file
 * @param expectedHash - expected file hash
 * @returns boolean
 */
export async function verifyFileHash(
  path: string,
  expectedHash: string
): Promise<boolean> {
  const main = getMainWindow();
  try {
    const hash = await sha256(path);
    return hash === expectedHash;
  } catch (error) {
    main?.webContents.send('logger', {
      message: 'Error during file verification',
      nativeError: error,
      type: LauncherLogs.error,
    });
    return false;
  }
}

export function getAllFilePaths(
  folderPath: string,
  isAbsolutePath: boolean = true
): string[] {
  const filePaths: string[] = [];

  function traverseDirectory(directory: string) {
    const files = readdirSync(directory);

    files.forEach((file) => {
      const filePath = join(directory, file);
      const fileStat = statSync(filePath);

      if (fileStat.isFile()) {
        filePaths.push(filePath);
      } else if (fileStat.isDirectory()) {
        traverseDirectory(filePath);
      }
    });
  }

  traverseDirectory(folderPath);

  if (isAbsolutePath) {
    return filePaths;
  }

  const serverPath = folderPath.replace(basename(folderPath), '');
  return filePaths.map((path: string) =>
    path.replace(serverPath, '').replaceAll('\\', '/')
  );
}

export function verifyFolder(
  folderPath: string,
  files: Record<string, IFileInformation>,
  serverPath: string
) {
  const main = getMainWindow();
  try {
    const filePaths = getAllFilePaths(folderPath, false);
    const filesToVerify = filePaths.map(async (path: string) => {
      const fileInfo: IFileInformation | undefined = files[path];
      const filePath = join(serverPath, path);
      if (fileInfo) {
        const verification: boolean = await verifyFileHash(
          filePath,
          fileInfo.hash
        );

        if (verification) {
          return;
        }

        const { url, size } = fileInfo;

        main?.webContents.send('logger', {
          message:
            'Some of game files was broken, starting their re-installation',
          type: LauncherLogs.warning,
        });
        await downloadFile(url, filePath, '', size);
      } else {
        // delete file if there is no path
        // gg cheats
        unlinkSync(filePath);
      }
    });

    Promise.all(filesToVerify).catch((error) => {
      main?.webContents.send('logger', {
        message: 'Error during folders verification',
        nativeError: error,
        type: LauncherLogs.error,
      });
    });
  } catch (error) {
    main?.webContents.send('logger', {
      message: 'Error during folder verification',
      nativeError: error,
      type: LauncherLogs.error,
    });
  }
}

export async function generateLaunchMinecraftCommand({
  username,
  memoryInGigabytes,
  serverName,
  serverIp,
}: {
  username: string;
  memoryInGigabytes: number;
  serverName: string | null;
  serverIp?: string;
}): Promise<string> {
  const serverFolderPath = getAppDataPath(`${GAME_FOLDER_NAME}/${serverName}`);
  const librariesFolderPath = join(serverFolderPath, 'libraries');
  const executableText = `start ${join(
    serverFolderPath,
    'jre',
    'bin',
    'javaw.exe'
  )}`;
  // todo: get java.exe path for diff OS
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
  `;
}

export function checkFileExists(filePath: string) {
  try {
    accessSync(filePath, constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

export function getServerFolder(serverName: string) {
  return getAppDataPath(`${GAME_FOLDER_NAME}/${serverName}`);
}
