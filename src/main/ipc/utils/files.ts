import {
  createWriteStream,
  createReadStream,
  unlinkSync,
  statSync,
  readdirSync,
} from 'fs';
import { createHash } from 'crypto';
import axios from 'axios';
import https from 'https';
import http from 'http';
import { basename, join } from 'path';
import getAppDataPath from 'appdata-path';
import { sleep } from '../../util';
import { getMainWindow } from '../../main';
import { IFileInformation } from '../../../types';
import { GAME_FOLDER_NAME } from '../../../constants/files';

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

  try {
    const response = await axios.get(url, {
      responseType: 'stream',
      httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 100 }),
      httpAgent: new http.Agent({ keepAlive: true, maxSockets: 100 }),
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
  const read = createReadStream(filePath);
  const hash = createHash('sha256').setEncoding('hex');

  read.pipe(hash);

  return new Promise((resolve, reject) => {
    read.on('finish', () => {
      hash.end();

      resolve(hash.read());
    });

    read.on('error', (err) => {
      hash.end();
      reject(err);
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
    main?.webContents.send('error', {
      message: 'Error during file verification',
      nativeError: error,
    });
    return false;
  }
}

export async function getAllFilePaths(folderPath: string): Promise<string[]> {
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

  return filePaths;
}

export async function verifyFolder(
  folderPath: string,
  files: Record<string, IFileInformation>
): Promise<any> {
  const main = getMainWindow();
  try {
    const filePaths = await getAllFilePaths(folderPath);

    const filesToVerify = filePaths.map(async (path: string) => {
      const fileInfo: IFileInformation | undefined = files[path];

      if (fileInfo) {
        const verification: boolean = await verifyFileHash(path, fileInfo.hash);

        if (verification) {
          return;
        }

        const { url, size } = fileInfo;
        const fileName = basename(path);

        await downloadFile(url, path, fileName, size);
      } else {
        // delete file if there is no path
        // gg cheats
        unlinkSync(path);
      }
    });

    Promise.all(filesToVerify)
      .then(() => {
        return main?.webContents.send('error', {
          message: `Files in ${basename(folderPath)} passed the verification`,
        });
      })
      .catch((error) => {
        main?.webContents.send('error', {
          message: 'Error during folder verification',
          nativeError: error,
        });
      });
  } catch (error) {
    main?.webContents.send('error', {
      message: 'Error during folder verification',
      nativeError: error,
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
  const librariesFolderPath = `${serverFolderPath}\\libraries`;
  const executableText = `${serverFolderPath}\\jre\\bin\\java.exe`;

  const librariesPaths = await getAllFilePaths(librariesFolderPath);
  const librariesString = librariesPaths.reduce((accumulator, libraryPath) => {
    return `${`${accumulator + libraryPath};`}`;
  }, '');
  const librariesVariable = `-cp "${librariesString}"`;
  const memoryVariable = `-Xmx${memoryInGigabytes}G`;
  const variables = `${memoryVariable} ${librariesVariable}`;

  const immutableParameters =
    '--gameDir . --assetsDir assets --accessToken 0 --tweakClass fabric.loader.Tweaker';
  const assetIndexParameter = '--assetIndex 1.19';
  const usernameParameter = `--username ${username}`;
  const autoConnectParameter = serverIp ? `--server ${serverIp}` : '';
  const parameters = `${immutableParameters} ${assetIndexParameter} ${usernameParameter} ${autoConnectParameter}`;

  return `cd ${serverFolderPath}
  ${executableText} ${variables} net.fabricmc.loader.impl.launch.knot.KnotClient ${parameters}
  `;
}
