import { ReactElement, useContext } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { auth } from '../../../services';
import { UserContext } from '../../../context/auth/UserContext';
import { Button, Frame, Layout } from '../../common';
import logo from '../../../../../assets/icons/logo-big.svg';

export function Main(): ReactElement {
  const { t } = useTranslation();
  const { userData, clearUserData } = useContext(UserContext);
  const handleLogout = () => {
    auth.logout();
    clearUserData();
  };

  return (
    <Layout mainBackground="bg-main-bg" sideBackground="bg-main-sides">
      <div className="flex h-full items-center gap-16">
        <Frame className="px-4 py-8">
          <div className="flex w-full flex-col items-center justify-center gap-3 text-sm">
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
          <Button className="w-[314px] py-4 text-22">{t('START_GAME')}</Button>
          <p className="mt-5 text-center">
            {t('ONLINE')} <span className="glow-text">{256}</span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
