import { URL } from 'url';
import path from 'path';
import dotenv from 'dotenv';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function configureEnvironment() {
  dotenv.config({
    path: path.join(__dirname, '../../', `.env.${process.env.NODE_ENV}`),
  });
}

export function resolveFilesURL(fileName: string) {
  return `file://${path.resolve(__dirname, '../../assets/files', fileName)}`;
}

export function resolveFilesPath(fileName: string) {
  return `${path.resolve(__dirname, '../../assets/files', fileName)}`;
}

export async function sleep(sleepTime: number): Promise<null> {
  await new Promise((resolve) => {
    setTimeout(resolve, sleepTime);
  });
  return null;
}
