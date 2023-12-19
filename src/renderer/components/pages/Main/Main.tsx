import { ReactElement, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'renderer/redux/auth/auth.slice';
import { Button, Dropdown, Frame, Layout } from '../../common';
import logo from '../../../../../assets/icons/logo-big.svg';
import { IServer } from '../../../types';
import {
  AppDispatch,
  AppState,
  getServerOnline,
  requestJavaServerInfo,
  requestServers,
  selectServer,
} from '../../../redux';

export function Main(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const { username } = useSelector((state: AppState) => state.auth.user);
  const { availableServers, selectedServer } = useSelector(
    (state: AppState) => state.main
  );
  const serverOnline = useSelector(getServerOnline);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => dispatch(logout());

  const handleStartGame = () => {
    navigate('/downloading');
  };

  useEffect(() => {
    dispatch(requestServers());
    if (!serverOnline) dispatch(requestJavaServerInfo());
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
                values={{ username }}
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
            disabled={!selectedServer || availableServers.length === 0}
            aria-label="Start game"
          >
            {t('START_GAME')}
          </Button>
          <p className="mt-5 text-center">
            {t('ONLINE')} <span className="glow-text">{serverOnline}</span>
          </p>
        </div>
        <Frame className="px-4 py-8">
          <h4 className="px-2 py-1">{t('CURRENT_SELECTED_SERVER')}</h4>
          <Dropdown<IServer>
            onSelect={(server: IServer) => dispatch(selectServer(server))}
            items={availableServers}
            defaultValue={availableServers[0]}
          />
        </Frame>
      </div>
    </Layout>
  );
}
