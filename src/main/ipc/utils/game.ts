import { dirname, basename, join, sep } from 'path';
import { existsSync, mkdirSync, writeFile } from 'fs';
import getAppDataPath from 'appdata-path';
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

export async function generateLaunchMinecraftCommandFabric({
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
  const librariesStrings = librariesPaths.reduce(
    (accumulator: string[], libraryPath) => {
      if (
        libraryPath.includes(`oceanlabs`) ||
        libraryPath.includes(`minecraft${sep}client`) ||
        libraryPath.includes('ForgeAutoRenamingTool') ||
        libraryPath.includes('google')
      ) {
        return accumulator;
      }

      const newPath = libraryPath
        .replace(`${serverFolderPath + sep}`, '')
        .replace(/\\[^\\]+$/, '\\*');

      if (accumulator.includes(newPath)) {
        return accumulator;
      }
      return [...accumulator, newPath];
    },
    []
  );
  const librariesString = librariesStrings.reduce(
    (accumulator, libraryString) => {
      return `${accumulator + libraryString};`;
    },
    ''
  );
  const librariesVariable = `-cp "libraries${sep}com${sep}google${sep}code${sep}findbugs${sep}jsr305${sep}3.0.2${sep}*;libraries${sep}com${sep}google${sep}code${sep}gson${sep}gson${sep}2.8.7${sep}*;libraries${sep}com${sep}google${sep}code${sep}gson${sep}gson${sep}2.8.9${sep}*;libraries${sep}com${sep}google${sep}errorprone${sep}error_prone_annotations${sep}2.1.3${sep}*;libraries${sep}com${sep}google${sep}guava${sep}failureaccess${sep}1.0.1${sep}*;libraries${sep}com${sep}google${sep}guava${sep}guava${sep}31.0.1-jre${sep}*;libraries${sep}com${sep}google${sep}j2objc${sep}j2objc-annotations${sep}1.1${sep}*;${librariesString}"`;
  const memoryVariable = `-Xmx${memoryInGigabytes}G`;
  const immutableVariables =
    '-XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M';
  const pVariables = `-p "libraries/cpw/mods/bootstraplauncher/1.1.2/bootstraplauncher-1.1.2.jar;libraries/cpw/mods/securejarhandler/2.1.4/securejarhandler-2.1.4.jar;libraries/org/ow2/asm/asm-commons/9.5/asm-commons-9.5.jar;libraries/org/ow2/asm/asm-util/9.5/asm-util-9.5.jar;libraries/org/ow2/asm/asm-analysis/9.5/asm-analysis-9.5.jar;libraries/org/ow2/asm/asm-tree/9.5/asm-tree-9.5.jar;libraries/org/ow2/asm/asm/9.5/asm-9.5.jar;libraries/net/minecraftforge/JarJarFileSystems/0.3.16/JarJarFileSystems-0.3.16.jar"`;
  const dVariables = `-Djava.net.preferIPv6Addresses=system -DignoreList=bootstraplauncher,securejarhandler,asm-commons,asm-util,asm-analysis,asm-tree,asm,JarJarFileSystems,client-extra,fmlcore,javafmllanguage,lowcodelanguage,mclanguage,forge-,1.19.2-forge-43.3.0.jar -DmergeModules=jna-5.10.0.jar,jna-platform-5.10.0.jar -DlibraryDirectory=libraries${sep}`;
  const addVariables = `--add-modules ALL-MODULE-PATH --add-opens java.base/java.util.jar=cpw.mods.securejarhandler --add-opens java.base/java.lang.invoke=cpw.mods.securejarhandler --add-exports java.base/sun.security.util=cpw.mods.securejarhandler --add-exports jdk.naming.dns/com.sun.jndi.dns=java.naming`;
  const variables = `${memoryVariable} ${immutableVariables} ${librariesVariable} ${dVariables} ${pVariables} ${addVariables}`;
  const immutableParameters =
    '--gameDir . --assetsDir assets --accessToken 0 --launchTarget forgeclient --fml.forgeGroup net.minecraftforge --fml.forgeVersion 43.3.2 --fml.mcVersion 1.19.2 --fml.mcpVersion 20220805.130853 --version release';
  const assetIndexVersion = basename(
    getAllFilePaths(join(serverFolderPath, 'assets', 'indexes'))[0]
  ).replace('.json', '');
  const assetIndexParameter = `--assetIndex ${assetIndexVersion}`;
  const usernameParameter = `--username ${username}`;
  const autoConnectParameter = serverIp ? `--server ${serverIp}` : '';
  const parameters = `${immutableParameters} ${assetIndexParameter} ${usernameParameter} ${autoConnectParameter}`;
  return `cd ${serverFolderPath}
  ${executableText} ${variables} cpw.mods.bootstraplauncher.BootstrapLauncher ${parameters}
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
      firstTimeDownloading: false,
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
    return null;
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
