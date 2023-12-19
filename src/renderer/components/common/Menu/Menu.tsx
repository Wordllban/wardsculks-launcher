import { ReactElement, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../redux';
import {
  CloseIcon,
  HideIcon,
  MaximizeIcon,
  MinimizeIcon,
  SettingsIcon,
} from '../icons';

export function Menu(): ReactElement {
  const { t } = useTranslation();
  const location = useLocation();
  const accessToken = useSelector((state: AppState) => state.auth.access);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleHide = () => {
    window.electron.ipcRenderer.sendMessage('minimize-window');
  };

  const handleMinMax = async () => {
    const isMinMax = await window.electron.ipcRenderer.invoke('min-max-window');
    setIsMaximized(isMinMax);
  };

  const handleClose = () => {
    window.electron.ipcRenderer.sendMessage('close-window');
  };

  return (
    <nav
      className={clsx(
        'fixed flex w-full items-center justify-end',
        'window-menu'
      )}
    >
      {accessToken && location.pathname !== '/downloading' ? (
        <Link
          to="/mods"
          className={clsx(
            'flex h-10 w-14 cursor-pointer items-center justify-center hover:bg-main/30',
            'window-menu-button pt-[2px] text-main',
            { 'bg-main/40': location.pathname === '/mods' }
          )}
        >
          {t('MODS_PAGE')}
        </Link>
      ) : null}
      {accessToken && location.pathname !== '/downloading' ? (
        <Link
          to="/settings"
          className={clsx(
            'flex h-10 w-12 cursor-pointer items-center justify-center hover:bg-main/30',
            'window-menu-button',
            { 'bg-main/40': location.pathname === '/settings' }
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
        aria-label="Hide window"
      >
        <HideIcon />
      </button>
      {window.env.NODE_ENV === 'development' && (
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
      )}
      <button
        className={clsx(
          'flex h-10 w-12 cursor-pointer items-center justify-center hover:bg-red-600/80',
          'window-menu-button'
        )}
        onClick={handleClose}
        type="button"
        aria-label="Close window"
      >
        <CloseIcon />
      </button>
    </nav>
  );
}
