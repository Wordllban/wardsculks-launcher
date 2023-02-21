import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, Frame, Input, Layout } from '../../common';
import logo from '../../../../../assets/icons/logo-big.svg';

// TODO: get this data from back-end
const online = 256;

export function Login(): ReactElement {
  const { t } = useTranslation();
  return (
    <Layout mainBackground="bg-login-main" sideBackground="bg-start-sides">
      <div className="ml-[48px] flex h-full items-center gap-10">
        <Frame className="max-w-[245px] px-7 py-10">
          <div className="flex-center-col">
            <h1 className="text-lg">{t('LOGIN')}</h1>
            <Input
              placeholder={t('LOGIN')}
              type="text"
              className="mt-2 w-full text-sm"
            />
            <Input
              placeholder={t('PASSWORD')}
              type="password"
              className="mt-4 w-full text-sm"
            />

            <div className="mt-6 w-full text-sm">
              <label className="flex">
                <Checkbox className="mr-2" />
                <span className="flex flex-row items-center text-sm">
                  {t('SAVE_PASSWORD')}
                </span>
              </label>
              <a
                className="hover:glow-text mt-2"
                href="https://github.com/Ward-Sculks"
              >
                {t('FORGOT_PASSWORD')}
              </a>
            </div>

            <Button
              title={t('LOGIN_BUTTON')}
              className="hover:glow-text my-[30px] px-[46px] pt-2 text-20"
            />

            <div className="text-sm">
              <p>{t('DONT_HAVE_ACCOUNT')}</p>
              <p>
                <a
                  className="hover:glow-text"
                  href="https://github.com/Ward-Sculks"
                >
                  {t('REGISTER')}
                </a>
              </p>
            </div>
          </div>
        </Frame>
        <div className="flex h-full flex-col items-center justify-end">
          <img src={logo} alt="wardsculks" />
          <p className="text-center">
            {t('ONLINE')} <span className="glow-text">{online}</span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
