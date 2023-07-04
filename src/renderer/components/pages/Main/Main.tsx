import {
  ReactElement,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { IServer } from 'renderer/types/IServer';
import { auth } from '../../../services';
import { UserContext } from '../../../context/auth/UserContext';
import { ErrorContext } from '../../../context/error/ErrorContext';
import { Button, Dropdown, Frame, Layout } from '../../common';
import logo from '../../../../../assets/icons/logo-big.svg';
import { retrieveServers } from '../../../services/api';

export function Main(): ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { userData, clearUserData } = useContext(UserContext);
  const { showError } = useContext(ErrorContext);

  const [availableServers, setAvailableServers] = useState<IServer[]>([]);
  const [selectedServer, setSelectedServer] = useState<IServer>();

  const handleLogout = useCallback(() => {
    auth.logout();
    clearUserData();
  }, [clearUserData]);

  const handleStartGame = useCallback(async () => {
    const isGameFolderExist = await window.electron.ipcRenderer.invoke(
      'find-game-folder',
      selectedServer?.name
    );

    if (isGameFolderExist) {
      // verify immutable folders
      // start game
      console.log('game start');
    } else {
      navigate(
        `/downloading?serverId=${selectedServer?.id}&serverName=${selectedServer?.name}`
      );
    }
  }, [navigate, selectedServer]);

  useEffect(() => {
    retrieveServers()
      .then((servers) => {
        setAvailableServers(servers);
        return setSelectedServer(servers[0]);
      })
      .catch((error) =>
        showError({
          message: t('FAILED_TO_GET_SERVERS_LIST'),
          nativeError: error,
        })
      );
  }, []);

  return (
    <Layout mainBackground="bg-main-bg">
      <div className="flex h-full items-center justify-between">
        <Frame className="px-4 py-8">
          <div className="flex w-full flex-col items-center justify-center gap-3">
            <img src={logo} alt="wardsculks" width="155" height="50" />
            <h1 className="text-center">
              <Trans
                className="text-center"
                i18nKey="WELCOME"
                defaults="Welcome, <br /> {{username}}"
                values={{ username: userData.username }}
                components={{ br: <br /> }}
              />
            </h1>

            <Link to="/login" className="text-main" onClick={handleLogout}>
              {t('LOGOUT')}
            </Link>
          </div>
        </Frame>
        <div className="flex h-full flex-col items-center justify-end">
          <Button className="w-[314px] py-4 text-22" onClick={handleStartGame}>
            {t('START_GAME')}
          </Button>
          <p className="mt-5 text-center">
            {t('ONLINE')} <span className="glow-text">{256}</span>
          </p>
        </div>
        <Frame className="px-4 py-8">
          <h4 className="px-2 py-1">{t('CURRENT_SELECTED_SERVER')}</h4>
          <Dropdown<IServer>
            onSelect={(server: IServer) => setSelectedServer(server)}
            items={availableServers}
            defaultValue={availableServers[0]}
          />
        </Frame>
      </div>
    </Layout>
  );
}
