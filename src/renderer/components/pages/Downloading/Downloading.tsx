import { ReactElement, useState, useEffect, useRef } from 'react';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ArrowBack, Layout } from '../../common';
import { ProgressBar } from './ProgressBar';
import { launch } from '../../../utils';
import { AppState } from '../../../redux';
import { IServer } from '../../../types';

const FINISHED_PROGRESS = 100;

export function Downloading(): ReactElement {
  const { username } = useSelector((state: AppState) => state.auth.user);
  const { ip, name, id } = useSelector(
    (state: AppState) => state.main.selectedServer
  ) as IServer;
  const logRef = useRef<HTMLDivElement>(null);

  const [downloadingStatus, setDownloadingStatus] = useState({
    progress: 0,
    downloadedSize: {
      value: 0,
      // todo: move to enum
      size: 'Bytes',
    },
  });

  window.electron.ipcRenderer.on('downloaded-size', (value) => {
    if (value.progress > downloadingStatus.progress) {
      setDownloadingStatus(value);
    }

    if (value.progress === FINISHED_PROGRESS && name && ip) {
      launch({ serverName: name, serverIp: ip, username });
    }
  });

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'downloading-log',
      (message: string): void => {
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
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('game-install', [id, name]);
  }, [id, name]);

  return (
    <Layout mainBackground="bg-update-bg">
      <ArrowBack
        position="absolute left-0 top-0"
        disabled={downloadingStatus.progress !== FINISHED_PROGRESS}
      />
      <div className="flex h-full flex-col items-center justify-end gap-6">
        <div className="flex w-full flex-row gap-6">
          <span className="glow-text flex h-48 w-[15%] grow-0 items-center justify-center bg-black/60 p-12 px-4 text-lg text-main">
            <Trans
              i18nKey="DOWNLOADING_SPEED"
              defaults="{{value}} {{size}}/S"
              values={{
                value: downloadingStatus.downloadedSize.value,
                size: downloadingStatus.downloadedSize.size,
              }}
              components={{ br: <br /> }}
            />
          </span>
          <div
            className="h-48 w-[80%] grow overflow-x-auto bg-black/60 p-4 text-xs"
            ref={logRef}
          />
        </div>
        <ProgressBar progress={downloadingStatus.progress} />
      </div>
    </Layout>
  );
}
