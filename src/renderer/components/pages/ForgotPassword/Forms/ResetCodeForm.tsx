import { ChangeEvent, FormEvent, ReactElement, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, Frame, Input, WithTimer } from '../../../common';
import { EMAIL_FIELD_PATTERN } from '../../../../../constants/regex';
import {
  AppDispatch,
  addNotification,
  requestResetCode,
} from '../../../../redux';
import { LauncherLogs } from '../../../../../types';

// in seconds
const REQUEST_CODE_COOLDOWN = 60;

type Props = {
  email: string;
  setEmail: (value: string) => void;
  setReadyForReset: (value: boolean) => void;
};

export function ResetCodeForm(props: Props): ReactElement {
  const { email, setEmail, setReadyForReset } = props;
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const [codeSent, setCodeSent] = useState<boolean>(false);

  const isValidEmail: boolean = useMemo((): boolean => {
    const regex = new RegExp(EMAIL_FIELD_PATTERN);
    return regex.test(email);
  }, [email]);

  const handleCodeRequest = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const response = await dispatch(requestResetCode(email));

    if (!response.payload) {
      dispatch(
        addNotification({
          key: 'CONFIRMATION_CODE_REQUESTED_SUCCESSFULLY',
          type: LauncherLogs.log,
        })
      );

      setCodeSent(true);
      setReadyForReset(true);
    } else {
      dispatch(
        addNotification({
          key: 'FAILED_TO_REQUEST_RESET_CODE',
          type: LauncherLogs.error,
          nativeError: response.payload,
        })
      );
    }
  };

  return (
    <form onSubmit={handleCodeRequest} className="h-full">
      <Frame className="flex h-full w-[360px] flex-col items-center justify-center px-8">
        <h2 className="w-full text-center text-lg">{t('FORGOT_PASSWORD')}</h2>
        <p className="my-2 ml-1 text-sm">{t('REQUEST_RESET_PASSWORD')}</p>
        <Input
          name="email"
          placeholder={t('EMAIL')}
          type="email"
          className="mt-4 w-full text-sm"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setEmail(event.target.value)
          }
          pattern={EMAIL_FIELD_PATTERN}
          required
          errorMessage={t('INVALID_EMAIL')}
          fullWidth
        />
        <div className="mt-8">
          <WithTimer
            timer={REQUEST_CODE_COOLDOWN}
            timerText={t('REQUEST_CODE_AGAIN')}
            onTimerEnd={() => setCodeSent(false)}
            timerTextHeight="h-4"
            disableStart={!isValidEmail}
          >
            <Button
              className="hover:glow-text px-[46px] py-3 text-22"
              disabled={codeSent || !isValidEmail}
              type="submit"
            >
              {t('REQUEST_CODE')}
            </Button>
          </WithTimer>
        </div>
      </Frame>
    </form>
  );
}
