import { ReactElement, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux';
import {
  CloseIcon,
  HideIcon,
  MaximizeIcon,
  MinimizeIcon,
  SettingsIcon,
} from '../icons';

export function Menu(): ReactElement {
  const accessToken = useSelector((state: AppState) => state.auth.access);
  const location = useLocation();
  const [isMaximized, setIsMaximized] = useState(false);

  const handleHide = useCallback(() => {
    window.electron.ipcRenderer.sendMessage('minimize-window');
  }, []);

  const handleMinMax = useCallback(async () => {
    const isMinMax = await window.electron.ipcRenderer.invoke('min-max-window');
    setIsMaximized(isMinMax);
  }, []);

  const handleClose = useCallback(() => {
    window.electron.ipcRenderer.sendMessage('close-window');
  }, []);

  return (
    <nav
      className={clsx(
        'fixed flex w-full items-center justify-end',
        'window-menu'
      )}
    >
      {accessToken && location.pathname !== '/downloading' ? (
        <Link
          to="/settings"
          className={clsx(
            'flex h-10 w-12 cursor-pointer items-center justify-center hover:bg-main/30',
            'window-menu-button'
          )}
        >
          <SettingsIcon />
        </Link>
      ) : null}
      <button
        className={clsx(
          'flex h-10 w-12 cursor-pointer items-center justify-center hover:bg-main/30',
          'window-menu-button'
        )}
        onClick={handleHide}
        type="button"
      >
        <HideIcon />
      </button>
      <button
        className={clsx(
          'flex h-10 w-12 cursor-pointer items-center justify-center hover:bg-main/30',
          'window-menu-button'
        )}
        onClick={handleMinMax}
        type="button"
      >
        {isMaximized ? <MinimizeIcon /> : <MaximizeIcon />}
      </button>
      <button
        className={clsx(
          'flex h-10 w-12 cursor-pointer items-center justify-center hover:bg-red-600/80',
          'window-menu-button'
        )}
        onClick={handleClose}
        type="button"
      >
        <CloseIcon />
      </button>
    </nav>
  );
}
