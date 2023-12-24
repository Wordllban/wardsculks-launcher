import { ReactElement, ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux';

type Props = {
  children: ReactNode;
};

export function GlobalLoader(props: Props): ReactElement {
  const { children } = props;

  const [appUpdating, setAppUpdating] = useState<boolean>(false);
  const isFetching: boolean = useSelector(
    (state: AppState) =>
      state.auth.isLoading ||
      state.main.isLoading ||
      state.mods.isLoading ||
      state.server.isLoading
  );

  const isLoading = appUpdating || isFetching;

  window.electron.ipcRenderer.on('app-update-downloading', (value: boolean) => {
    setAppUpdating(value);
  });

  return (
    <div className="relative">
      {isLoading ? (
        <div className="absolute left-0 top-0 z-[99] flex h-full w-full flex-col items-center justify-center bg-black/70">
          <span className="loading-animation" aria-label="Loading..." />
        </div>
      ) : null}
      {children}
    </div>
  );
}
