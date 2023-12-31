import {
  ReactElement,
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosError } from 'axios';
import {
  Button,
  Checkbox,
  Frame,
  Input,
  Layout,
  PasswordInput,
  ServerOnline,
} from '../../common';
import { LauncherLogs } from '../../../../types';
import {
  logout,
  requestTokens,
  requestUser,
  updateAccessToken,
} from '../../../redux/auth/auth.slice';
import {
  IGetUserFromTokenResponse,
  IRefreshAccessResponse,
  IRetrieveTokensResponse,
  IUser,
} from '../../../services/api';
import {
  addNotification,
  AppDispatch,
  AppState,
  getServerOnline,
  requestJavaServerInfo,
} from '../../../redux';
import { USERNAME_FIELD_PATTERN } from '../../../../constants/regex';

export function Login(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const serverOnline = useSelector(getServerOnline);
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

    const response = (await dispatch(requestTokens({ username, password })))
      .payload;

    const { access, refresh } = response as IRetrieveTokensResponse;

    if (access && refresh) {
      const user = (await dispatch(requestUser(access))).payload as IUser;
      if (!user || !user?.id) {
        dispatch(logout());
        return;
      }
      window.electron.ipcRenderer.sendMessage('save-access-token', [access]);
      if (isSavePassword) {
        window.electron.ipcRenderer.sendMessage('save-refresh-token', [
          refresh,
        ]);
      }
      navigate('/main-menu');
    } else {
      dispatch(
        addNotification({
          message: t('FAILED_TO_LOGIN'),
          type: LauncherLogs.error,
        })
      );
    }
  };

  let refreshToken: string = useSelector(
    (state: AppState) => state.auth.refresh
  );
  useEffect(() => {
    const login = async (): Promise<void> => {
      try {
        if (!refreshToken) {
          refreshToken = await window.electron.ipcRenderer.invoke(
            'get-refresh-token'
          );
        }

        if (!refreshToken) {
          dispatch(logout());
          return;
        }

        // get new tokens
        const response = (await dispatch(updateAccessToken(refreshToken)))
          .payload;

        const { access } = response as IRefreshAccessResponse;

        if (access) {
          // get user from token
          const user = (await dispatch(requestUser(access)))
            .payload as IGetUserFromTokenResponse;

          if (user && user.username) {
            // save new data
            window.electron.ipcRenderer.sendMessage('save-access-token', [
              access,
            ]);
            return navigate('/main-menu');
          }
        }

        throw new Error(t('SESSION_EXPIRED_PLEASE_RELOGIN'));
      } catch (error) {
        dispatch(
          addNotification({
            type: LauncherLogs.error,
            message: t('SESSION_EXPIRED_PLEASE_RELOGIN'),
            nativeError:
              (error as AxiosError)?.message || JSON.stringify(error),
          })
        );
        dispatch(logout());
        navigate('/login');
      }
    };

    login();
  }, []);

  useEffect(() => {
    if (!serverOnline) dispatch(requestJavaServerInfo());
  }, []);

  return (
    <Layout mainBackground="bg-login-bg">
      <div className="flex h-full items-center gap-[26px]">
        <Frame className="max-w-[245px] px-7 py-8">
          <div className="flex flex-col items-start justify-center">
            <h1 className="w-full text-center text-lg">{t('LOGIN')}</h1>
            <form onSubmit={handleLogin}>
              <Input
                name="username"
                placeholder={t('LOGIN_FIELD')}
                type="text"
                className="mb-4 mt-2 w-full text-sm"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setUsername(event.target.value)
                }
                minLength={2}
                maxLength={16}
                pattern={USERNAME_FIELD_PATTERN}
                required
                errorMessage={t('INVALID_LOGIN')}
              />
              <PasswordInput
                name="password"
                placeholder={t('PASSWORD')}
                type="password"
                className="w-full text-sm"
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
              <Button
                className="hover:glow-text my-[25px] px-[46px] py-3 text-22"
                aria-label="Login"
              >
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
          <ServerOnline />
        </div>
      </div>
    </Layout>
  );
}
