import { ReactElement, useEffect, useRef } from 'react';
import { Layout } from '../../common';

const getProgressStyle = () => ({ width: '20%' });

export function Downloading(): ReactElement {
  const logRef = useRef<HTMLDivElement>(null);

  window.electron.ipcRenderer.on('downloading-log', (message: string): void => {
    if (!logRef.current) return;

    if (logRef.current.childNodes.length >= 6) {
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

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('game-install', '1');
  }, []);

  return (
    <Layout mainBackground="bg-update-bg" sideBackground="bg-update-sides">
      <div className="flex h-full flex-col items-center justify-end gap-6">
        <div className="flex w-full flex-row gap-6">
          <span className="glow-text flex h-32 w-[15%] grow-0 items-center justify-center bg-black/60 p-12 px-4 text-lg text-main">
            15 MB/S
          </span>
          <div
            className="max-h-32 w-[80%] grow overflow-x-auto bg-black/60 p-4 text-xs"
            ref={logRef}
          />
        </div>
        <div className="w-full border-4 border-cyan-900 bg-black/60 px-3 py-4">
          <div className="border-4 border-main bg-[#272727]">
            <span className="block h-10 bg-main" style={getProgressStyle()} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
