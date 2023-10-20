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
import { basename, join, relative } from 'path';
import { sleep /* , filterObjectKeys  */ } from '../../../utils';
import { getMainWindow } from '../../main';
import { LauncherLogs, ReleaseFileList } from '../../../types';

import getAxios from '../../services/axios';

export async function downloadFile(
  url: string,
  filePath: string,
  fileName: string,
  fileSize: number,
  maxRetries: number = 10
): Promise<void> {
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
    return main?.webContents.send(
      'downloading-log',
      `Failed to download file: ${fileName}`
    );
  }
}

/**
 * Create sha256 hash
 * @param {string} filePath
 * @returns {string} hash
 */
export const sha256 = (filePath: string): Promise<string> => {
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
      if (stats.isFile() && !file.includes('release')) {
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
      key: 'SOME_FILES_WAS_BROKEN',
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

/**
 * Verifying files in immutable folders. Unnecessary files will be deleted.
 *
 * Returns array of damaged files, that should be re-installed.
 * @param {String} folderPath
 * @param {ReleaseFileList} files
 * @param {String} serverPath
 *
 * @returns array of damaged files, that should be re-installed.
 */
export async function verifyFolder(
  folderPath: string,
  files: ReleaseFileList,
  serverPath: string,
  immutableFolders: string[]
) {
  const main = getMainWindow();

  // we passing whole server folder to verify when new release
  /* const isNewRelease = folderPath === serverPath;

  const filesToReinstall = isNewRelease
    ? files
    : filterObjectKeys(files, (keyToCheck: string) => {
        return keyToCheck.startsWith(basename(folderPath));
      }); */

  const filesToReinstall = files;
  try {
    const filePaths = getAllFilePaths(folderPath, true);

    await Promise.all(
      filePaths.map(async (file) => {
        const relativePath = relative(serverPath, file).replaceAll('\\', '/');
        const fileInfo = files[relativePath];

        if (fileInfo) {
          const isHashEqual: boolean = await verifyFileHash(
            file,
            fileInfo.hash
          );
          if (isHashEqual) {
            delete filesToReinstall[relativePath];
          }
        } else {
          // remove unnecessary file from immutable folders
          const inImmutableFolder = immutableFolders.some((folder: string) =>
            relativePath.includes(folder)
          );
          if (inImmutableFolder) {
            unlinkSync(file);
          }
        }
      })
    );

    return filesToReinstall;
  } catch (error) {
    main?.webContents.send('logger', {
      key: 'ERROR_DURING_FILE_VERIFICATION',
      nativeError: error,
      type: LauncherLogs.error,
    });

    return {};
  }
}

export function checkFileExists(filePath: string): boolean {
  try {
    accessSync(filePath, constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}
