import { ReactElement, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { Layout } from '../../common';
import { ProgressBar } from './ProgressBar';

export function Downloading(): ReactElement {
  const [downloadingStatus, setDownloadingStatus] = useState({
    progress: 0,
    downloadedSize: {
      value: 0,
      // todo: move to enum
      size: 'Bytes',
    },
  });

  useEffect(() => {
    window.electron.ipcRenderer.on('downloaded-size', (value) => {
      if (value.progress > downloadingStatus.progress) {
        setDownloadingStatus(value);
      }
    });
  }, [downloadingStatus.progress]);

  const logRef = useRef<HTMLDivElement>(null);
  const [params] = useSearchParams();

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
    window.electron.ipcRenderer.sendMessage('game-install', [
      params.get('serverId'),
      params.get('serverName'),
    ]);
  }, [params]);

  return (
    <Layout mainBackground="bg-update-bg">
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
