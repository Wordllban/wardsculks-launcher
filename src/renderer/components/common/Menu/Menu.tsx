import { ReactElement, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import settingsIcon from '../../../../../assets/icons/settings.svg';
import hideIcon from '../../../../../assets/icons/hide.svg';
import maximizeIcon from '../../../../../assets/icons/maximize.svg';
import minimizeIcon from '../../../../../assets/icons/minimize.svg';
import closeIcon from '../../../../../assets/icons/close.svg';
import { AppState } from '../../../redux';

export function Menu(): ReactElement {
  const accessToken = useSelector((state: AppState) => state.auth.access);

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
      {accessToken ? (
        <Link
          to="/settings"
          className={clsx(
            'flex h-10 w-12 cursor-pointer items-center justify-center hover:bg-main/30',
            'window-menu-button'
          )}
        >
          <img src={settingsIcon} alt="settings" />
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
        <img src={hideIcon} alt="minimize" />
      </button>
      <button
        className={clsx(
          'flex h-10 w-12 cursor-pointer items-center justify-center hover:bg-main/30',
          'window-menu-button'
        )}
        onClick={handleMinMax}
        type="button"
      >
        <img
          src={isMaximized ? minimizeIcon : maximizeIcon}
          alt="maximize or restore"
        />
      </button>
      <button
        className={clsx(
          'flex h-10 w-12 cursor-pointer items-center justify-center hover:bg-red-600/80',
          'window-menu-button'
        )}
        onClick={handleClose}
        type="button"
      >
        <img src={closeIcon} alt="close" />
      </button>
    </nav>
  );
}
