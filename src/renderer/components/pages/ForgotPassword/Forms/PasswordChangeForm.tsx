import { FormEvent, ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { requestPasswordReset } from 'renderer/services/api';
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Frame, Input, PasswordInput } from '../../../common';
import {
  STRONG_PASSWORD_PATTERN,
  USERNAME_FIELD_PATTERN,
} from '../../../../../constants/regex';
import { addNotification } from '../../../../redux';
import { LauncherLogs } from '../../../../../types';
import { sleep } from '../../../../../utils';

const CONFIRMATION_CODE_LENGTH = 6;

type Props = {
  email: string;
};

export function PasswordChangeForm(props: Props) {
  const { email } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');

  const handleChangePasswordRequest = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      await requestPasswordReset(email, code, newPassword);
      dispatch(
        addNotification({
          message: t('PASSWORD_CHANGED_SUCCESSFULLY'),
          type: LauncherLogs.log,
        })
      );

      await sleep(500);

      dispatch(
        addNotification({
          message: t('REDIRECT_AFTER_PASSWORD_CHANGE'),
          type: LauncherLogs.log,
          lifetime: 4000,
        })
      );
      await sleep(3000);
      navigate('/main-menu');
    } catch (error) {
      dispatch(
        addNotification({
          message: t('FAILED_TO_REQUEST_PASSWORD_CHANGE'),
          type: LauncherLogs.error,
          nativeError: (error as AxiosError)?.message || JSON.stringify(error),
        })
      );
    }
  };

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCode(event.target.value);
  };

  const handleNewPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setNewPassword(event.target.value);
  };

  const handleNewPasswordRepeatChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setNewPasswordRepeat(event.target.value);
  };

  const isDisabled =
    !newPassword ||
    !newPasswordRepeat ||
    newPassword !== newPasswordRepeat ||
    code.length < CONFIRMATION_CODE_LENGTH;

  return (
    <form onSubmit={handleChangePasswordRequest} className="h-full">
      <Frame className="flex h-full w-[360px] flex-col items-center justify-center px-8">
        <h2 className="mb-2 w-full text-center text-lg">
          {t('CHANGE_PASSWORD')}
        </h2>
        <div className="mb-4 w-full">
          <Input
            pattern={USERNAME_FIELD_PATTERN}
            placeholder={t('CONFIRMATION_CODE')}
            className="w-full text-sm"
            minLength={CONFIRMATION_CODE_LENGTH}
            maxLength={CONFIRMATION_CODE_LENGTH}
            fullWidth
            onChange={handleCodeChange}
            errorMessage={t('INVALID_CONFIRMATION_CODE')}
            required
          />
        </div>
        <div className="mb-4 w-full">
          <PasswordInput
            pattern={STRONG_PASSWORD_PATTERN}
            placeholder={t('NEW_PASSWORD')}
            className="w-full text-sm"
            fullWidth
            onChange={handleNewPasswordChange}
            errorMessage={t('WEAK_PASSWORD')}
            required
          />
        </div>
        <PasswordInput
          pattern={newPassword}
          placeholder={t('REPEAT_NEW_PASSWORD')}
          className="w-full text-sm"
          fullWidth
          onChange={handleNewPasswordRepeatChange}
          errorMessage={t('PASSWORDS_NOT_EQUAL')}
          required
        />
        <Button
          className="hover:glow-text mb-6 mt-8 px-[46px] py-3 text-22"
          type="submit"
          disabled={isDisabled}
        >
          {t('CHANGE_PASSWORD_BUTTON')}
        </Button>
      </Frame>
    </form>
  );
}
