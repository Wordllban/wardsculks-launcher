import {
  useState,
  ReactElement,
  ChangeEvent,
  FormEvent,
  useCallback,
} from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Layout,
  Frame,
  Input,
  Checkbox,
  Button,
  PasswordInput,
} from '../../common';
import { LauncherLogs } from '../../../../types';
import { register } from '../../../redux/auth/auth.slice';
import { ICreateUserResponse } from '../../../services/api';
import { addNotification, AppDispatch } from '../../../redux';

export function Registration(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [isAgreementAccepted, setIsAgreementAccepted] =
    useState<boolean>(false);

  const handleRegistration = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const response = (await dispatch(register({ username, password, email })))
      .payload;
    const { user, access, refresh } = response as ICreateUserResponse;

    if (user && access && refresh) {
      window.electron.ipcRenderer.sendMessage('save-access-token', [access]);
      window.electron.ipcRenderer.sendMessage('save-refresh-token', [refresh]);

      navigate('/main-menu');
    } else {
      dispatch(
        addNotification({
          message: t('FAILED_TO_REGISTER'),
          type: LauncherLogs.error,
          nativeError: response,
        })
      );
    }
  };

  const handleRulesOpen = useCallback(() => {
    setIsAgreementAccepted(true);
    window.electron.ipcRenderer.sendMessage(
      'open-remote-file',
      window.env.RULES_URL
    );
  }, []);

  return (
    <Layout mainBackground="bg-registration-bg">
      <div className="flex h-full items-center justify-end gap-10">
        <Frame className="max-w-[385px] px-7 py-8">
          <h1 className="w-full text-center text-lg">{t('REGISTRATION')}</h1>
          <form onSubmit={handleRegistration}>
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
              pattern="^(?!.*(qwe|QWE|123))(?=.*\d)(?=.*[A-Z]).{6,}$"
              errorMessage={t('WEAK_PASSWORD')}
            />
            <Input
              name="email"
              placeholder={t('EMAIL')}
              type="email"
              className="mt-4 w-full text-sm"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setEmail(event.target.value)
              }
              minLength={6}
              required
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
              errorMessage={t('INVALID_EMAIL')}
            />
            <div className="mt-6 w-full text-sm">
              <label className="flex">
                <Checkbox
                  className="mr-2"
                  onChange={() => setIsAgreementAccepted(!isAgreementAccepted)}
                  checked={isAgreementAccepted}
                />
                <Trans
                  className="flex flex-row items-center justify-start"
                  i18nKey="CONFIRM_AGREEMENT"
                  components={{
                    wrapper: (
                      <button
                        className="mx-1 text-main"
                        onClick={handleRulesOpen}
                        type="button"
                        aria-label="Terms of use"
                      />
                    ),
                  }}
                />
              </label>
            </div>
            <Button
              className="hover:glow-text my-[25px] px-[46px] py-3 text-22"
              type="submit"
              disabled={!isAgreementAccepted}
            >
              {t('REGISTER')}
            </Button>
          </form>
          <div className="text-sm">
            <p>
              {t('HAVE_ACCOUNT')}{' '}
              <Link className="hover:glow-text text-main" to="/login">
                {t('TO_LOGIN')}
              </Link>
            </p>
          </div>
        </Frame>
      </div>
    </Layout>
  );
}
