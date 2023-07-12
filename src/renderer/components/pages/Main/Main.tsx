import {
  ReactElement,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../../services';
import { UserContext } from '../../../context/auth/UserContext';
import { LoggerContext } from '../../../context/logger/LoggerContext';
import { Button, Dropdown, Frame, Layout } from '../../common';
import logo from '../../../../../assets/icons/logo-big.svg';
import { retrieveServers } from '../../../services/api';
import { LauncherLogs } from '../../../../types';
import { IServer } from '../../../types';
import { launch } from '../../../utils';

export function Main(): ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { userData, clearUserData } = useContext(UserContext);
  const { showMessage } = useContext(LoggerContext);

  const [availableServers, setAvailableServers] = useState<IServer[]>([]);
  const [selectedServer, setSelectedServer] = useState<IServer>();

  const handleLogout = useCallback(() => {
    auth.logout();
    clearUserData();
  }, [clearUserData]);

  const handleStartGame = useCallback(async () => {
    const gameFolder = await window.electron.ipcRenderer.invoke(
      'find-game-folder',
      selectedServer?.name
    );

    if (gameFolder && selectedServer) {
      // verify immutable folders
      const isVerified = await window.electron.ipcRenderer.invoke(
        'verify-folders',
        {
          foldersNames: selectedServer?.immutableFolders,
          serverName: selectedServer?.name,
          serverId: selectedServer?.id,
        }
      );

      if (isVerified) {
        launch({
          serverName: selectedServer.name,
          serverIp: selectedServer.ip,
          username: userData.username,
        });
      }
    } else {
      navigate(
        `/downloading?serverId=${selectedServer?.id}&serverName=${selectedServer?.name}&serverIp=${selectedServer?.ip}`
      );
    }
  }, [navigate, selectedServer, userData.username]);

  useEffect(() => {
    retrieveServers()
      .then((servers) => {
        setAvailableServers(servers);
        return setSelectedServer(servers[0]);
      })
      .catch((error) =>
        showMessage({
          message: t('FAILED_TO_GET_SERVERS_LIST'),
          nativeError: error,
          type: LauncherLogs.error,
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
          <Button
            className="w-[314px] py-4 text-22"
            onClick={handleStartGame}
            disabled={!selectedServer}
          >
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
