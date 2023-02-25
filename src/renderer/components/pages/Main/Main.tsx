import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button, Frame, Layout } from '../../common';
import logo from '../../../../../assets/icons/logo-big.svg';

export function Main(): ReactElement {
  const { t } = useTranslation();

  return (
    <Layout mainBackground="bg-main-bg" sideBackground="bg-main-sides">
      <div className="flex h-full items-center gap-16">
        <Frame className="py-8 px-4">
          <div className="flex-center-col w-full gap-3 text-sm">
            <img src={logo} alt="wardsculks" width="155" height="50" />
            <h1 className="text-center">
              Вітаємо, <br /> Wordllban
            </h1>
            <Link className="text-main" to="/login">
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
