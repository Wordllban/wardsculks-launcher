import { createWriteStream, createReadStream, unlinkSync } from 'fs';
import { createHash } from 'crypto';
import axios from 'axios';
import https from 'https';
import http from 'http';
import { join } from 'path';
import { sleep } from '../../util';
import { getMainWindow } from '../../main';

export async function downloadFile(
  url: string,
  filePath: string,
  fileName: string,
  fileSize: number,
  maxRetries: number = 10
): Promise<void | null> {
  const fileFullPath = join(filePath, fileName);
  const writer = createWriteStream(fileFullPath);
  // const startTime = new Date();

  const main = getMainWindow();

  try {
    const response = await axios.get(url, {
      responseType: 'stream',
      httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 100 }),
      httpAgent: new http.Agent({ keepAlive: true, maxSockets: 100 }),
    });

    const responseSize = response.headers['content-length'];

    /* const endTime = new Date();
    const durationInSeconds = (Number(endTime) - Number(startTime)) / 1000;
    const downloadSpeedInBytesPerSecond = responseSize / durationInSeconds;
    const downloadSpeedInKBPerSecond =
      downloadSpeedInBytesPerSecond / (1024 * 1024); */

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
