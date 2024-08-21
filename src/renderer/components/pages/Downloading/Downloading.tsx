import { ReactElement, useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LauncherLogs } from 'types';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Layout } from '../../common';
import { ProgressBar } from './ProgressBar';
import { launch } from '../../../utils';
import { AppDispatch, AppState, addNotification } from '../../../redux';
import { FINISHED_PROGRESS } from './constants';
import { MemorySizing } from '../../../../utils';

export function Downloading(): ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const logRef = useRef<HTMLDivElement>(null);

  const { username } = useSelector((state: AppState) => state.auth.user);
  const { ip, name, id, version, immutableFolders } = useSelector(
    (state: AppState) => state.main.selectedServer
  );

  const [downloadingStatus, setDownloadingStatus] = useState({
    progress: 0,
    downloadedSize: {
      value: 0,
      size: MemorySizing.BYTES,
    },
    firstTimeDownloading: false,
  });

  useEffect(() => {
    window.electron.ipcRenderer.on('downloaded-size', (value) => {
      return setDownloadingStatus(value);
    });
  }, []);

  useEffect(() => {
    if (
      downloadingStatus.progress >= FINISHED_PROGRESS &&
      downloadingStatus.firstTimeDownloading
    ) {
      launch({ serverName: name, serverIp: ip, username });
    }
  }, [
    downloadingStatus.progress,
    downloadingStatus.firstTimeDownloading,
    name,
    ip,
    username,
  ]);

  window.electron.ipcRenderer.on('downloading-log', (message: string): void => {
    if (!logRef.current) return;

    if (logRef.current.childNodes.length >= 8) {
      if (logRef.current.firstChild) {
        logRef.current.removeChild(logRef.current.firstChild);
        logRef.current.removeChild(logRef.current.firstChild);
        return logRef.current.append(
          document.createTextNode(message),
          document.createElement('br')
        );
      }
    }
    return logRef.current.append(
      document.createTextNode(message),
      document.createElement('br')
    );
  });

  const handleStartGame = useCallback(async (): Promise<void> => {
    // if no server selected
    if (!name) {
      navigate('/main-menu');
      return;
    }

    const gameFolder = await window.electron.ipcRenderer.invoke(
      'find-game-folder',
      name
    );

    if (gameFolder) {
      const localReleaseVersion = await window.electron.ipcRenderer.invoke(
        'get-local-release-version',
        {
          serverName: name,
          serverId: id,
        }
      );

      // verify immutable folders
      const isVerified = await window.electron.ipcRenderer.invoke(
        'verify-folders',
        {
          immutableFolders,
          serverName: name,
          serverId: id,
          isUpToDateRelease: version === localReleaseVersion,
        }
      );

      if (isVerified) {
        launch({
          serverName: name,
          serverIp: ip,
          username,
        });
      } else {
        navigate('/main-menu');
        dispatch(
          addNotification({
            message: t('ERROR_DURING_FILE_VERIFICATION'),
            type: LauncherLogs.error,
          })
        );
      }
    } else {
      window.electron.ipcRenderer.sendMessage('game-install', [id, name]);
    }
  }, [ip, name, id, version, immutableFolders, username]);

  useEffect(() => {
    handleStartGame();
  }, []);

  const value =
    downloadingStatus.progress >= FINISHED_PROGRESS
      ? 0
      : downloadingStatus.downloadedSize.value;

  return (
    <Layout mainBackground="bg-update-bg">
      <ArrowBack
        position="absolute left-0 top-0"
        disabled={downloadingStatus.progress < FINISHED_PROGRESS}
      />
      <div className="flex h-full flex-col items-center justify-end gap-6">
        <div className="flex w-full flex-row gap-6">
          <span className="glow-text flex h-48 w-[15%] grow-0 items-center justify-center bg-black/60 p-12 px-4 text-center text-lg text-main">
            <Trans
              i18nKey="DOWNLOADING_SPEED"
              defaults="{{value}} {{size}}/S"
              values={{
                value: Number.isNaN(value) ? 0 : value,
                size:
                  downloadingStatus.progress >= FINISHED_PROGRESS
                    ? MemorySizing.BYTES
                    : downloadingStatus.downloadedSize.size,
              }}
              components={{ br: <br /> }}
            />
          </span>
          <div
            className="h-48 w-[80%] grow select-text overflow-x-auto bg-black/60 p-4 text-xs"
            ref={logRef}
          />
        </div>
        <ProgressBar progress={downloadingStatus.progress} />
      </div>
    </Layout>
  );
}
