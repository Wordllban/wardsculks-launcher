import {
  ReactElement,
  useState,
  FormEvent,
  ChangeEvent,
  useContext,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../../services';
import {
  Button,
  Checkbox,
  Frame,
  Input,
  Layout,
  PasswordInput,
} from '../../common';
import logo from '../../../../../assets/icons/logo-big.svg';
import { UserContext } from '../../../context/auth/UserContext';
import { LoggerContext } from '../../../context/logger/LoggerContext';
import { LauncherLogs } from '../../../../types';

export function Login(): ReactElement {
  const { setUserData } = useContext(UserContext);
  const { showMessage } = useContext(LoggerContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [isSavePassword, setSavePassword] = useState<boolean>(false);

  const handleSavePassword = (): void => {
    setSavePassword(!isSavePassword);
  };

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const { access, refresh } = await auth.requestTokens(username, password);

    if (access && refresh) {
      setUserData({ access, username });
      window.electron.ipcRenderer.sendMessage('save-access-token', [access]);
      if (isSavePassword) {
        window.electron.ipcRenderer.sendMessage('save-refresh-token', [
          refresh,
        ]);
      }
      navigate('/main-menu');
    } else {
      showMessage({ message: t('FAILED_TO_LOGIN'), type: LauncherLogs.error });
    }
  };

  return (
    <Layout mainBackground="bg-login-bg">
      <div className="flex h-full items-center gap-10">
        <Frame className="max-w-[245px] px-7 py-8">
          <div className="flex flex-col items-start justify-center">
            <h1 className="w-full text-center text-lg">{t('LOGIN')}</h1>
            <form onSubmit={handleLogin}>
              <Input
                name="username"
                placeholder={t('LOGIN_FIELD')}
                type="text"
                className="mt-2 w-full text-sm"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setUsername(event.target.value)
                }
                minLength={2}
                maxLength={16}
                pattern="^[a-zA-Z0-9_]*$"
                required
                errorMessage={t('INVALID_LOGIN')}
              />
              <PasswordInput
                name="password"
                placeholder={t('PASSWORD')}
                type="password"
                className="mt-4 w-full text-sm"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setPassword(event.target.value)
                }
                minLength={6}
                required
                errorMessage={t('INVALID_PASSWORD')}
              />
              <div className="mt-6 w-full text-sm">
                <label className="flex">
                  <Checkbox
                    className="mr-2"
                    onChange={handleSavePassword}
                    checked={isSavePassword}
                  />
                  <span className="flex flex-row items-center text-sm">
                    {t('SAVE_PASSWORD')}
                  </span>
                </label>
                <Link
                  className="hover:glow-text mt-2 text-main"
                  to="/forgot-password"
                >
                  {t('FORGOT_PASSWORD')}
                </Link>
              </div>
              <Button className="hover:glow-text my-[25px] px-[46px] py-3 text-22">
                {t('LOGIN_BUTTON')}
              </Button>
            </form>

            <div className="text-sm">
              <p>{t('DONT_HAVE_ACCOUNT')}</p>
              <p>
                <Link className="hover:glow-text text-main" to="/registration">
                  {t('REGISTER')}
                </Link>
              </p>
            </div>
          </div>
        </Frame>
        <div className="flex h-full flex-col items-center justify-end">
          <img src={logo} alt="wardsculks" />
          <p className="text-center">
            {/**
             * TODO: Fetch real live online
             */}
            {t('ONLINE')} <span className="glow-text">{256}</span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
