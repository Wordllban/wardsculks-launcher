import { ReactElement, useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import settingsIcon from '../../../../../assets/icons/settings.svg';
import hideIcon from '../../../../../assets/icons/hide.svg';
import maximizeIcon from '../../../../../assets/icons/maximize.svg';
import minimizeIcon from '../../../../../assets/icons/minimize.svg';
import closeIcon from '../../../../../assets/icons/close.svg';
import { UserContext } from '../../../context/auth/UserContext';

export function Menu(): ReactElement {
  const { userData } = useContext(UserContext);

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
    <nav className="fixed flex w-full items-center justify-end">
      {userData.access ? (
        <Link
          to="/settings"
          className="flex h-10 w-12 cursor-pointer items-center justify-center hover:bg-main/30"
        >
          <img src={settingsIcon} alt="settings" />
        </Link>
      ) : null}
      <button
        className="flex h-10 w-12 cursor-pointer items-center justify-center hover:bg-main/30"
        onClick={handleHide}
        type="button"
      >
        <img src={hideIcon} alt="minimize" />
      </button>
      <button
        className="flex h-10 w-12 items-center justify-center hover:bg-main/30"
        onClick={handleMinMax}
        type="button"
      >
        <img
          src={isMaximized ? minimizeIcon : maximizeIcon}
          alt="maximize or restore"
        />
      </button>
      <button
        className="flex h-10 w-12 items-center justify-center hover:bg-red-600/80"
        onClick={handleClose}
        type="button"
      >
        <img src={closeIcon} alt="close" />
      </button>
    </nav>
  );
}
