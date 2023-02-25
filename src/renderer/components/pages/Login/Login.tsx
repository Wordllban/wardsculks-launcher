import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Checkbox, Frame, Input, Layout } from '../../common';
import logo from '../../../../../assets/icons/logo-big.svg';

const loginUrl = 'http://localhost:8000/users/auth/token/obtain';

const login = async (username: string, password: string) => {
  axios
    .post(loginUrl, {
      username,
      password,
    })
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
};

export function Login(): ReactElement {
  const { t } = useTranslation();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <Layout mainBackground="bg-login-bg" sideBackground="bg-login-sides">
      <div className="flex h-full items-center gap-10">
        <Frame className="max-w-[245px] px-7 py-8">
          <div className="flex-start-col">
            <h1 className="w-full text-center">{t('LOGIN')}</h1>
            <Input
              placeholder={t('LOGIN')}
              type="text"
              className="mt-2 w-full text-sm"
              onChange={(event) => setUsername(event.target.value)}
              value={username}
            />
            <Input
              placeholder={t('PASSWORD')}
              type="password"
              className="mt-4 w-full text-sm"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
            />

            <div className="mt-6 w-full text-sm">
              <label className="flex">
                <Checkbox className="mr-2" />
                <span className="flex flex-row items-center text-sm">
                  {t('SAVE_PASSWORD')}
                </span>
              </label>
              <a
                className="hover:glow-text mt-2 text-main"
                href="https://github.com/Ward-Sculks"
              >
                {t('FORGOT_PASSWORD')}
              </a>
            </div>

            <Link to="/main-menu">
              <Button
                className="hover:glow-text my-[25px] px-[46px] py-3 text-22"
                onClick={() => login(username, password)}
              >
                {t('LOGIN_BUTTON')}
              </Button>
            </Link>

            <div className="text-sm">
              <p>{t('DONT_HAVE_ACCOUNT')}</p>
              <p>
                <a
                  className="hover:glow-text text-main"
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
            {t('ONLINE')} <span className="glow-text">{256}</span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
