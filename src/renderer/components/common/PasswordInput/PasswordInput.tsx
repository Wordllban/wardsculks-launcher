import { useState, ReactElement } from 'react';
import clsx from 'clsx';
import { Input, InputProps } from '../Input';
import { EyeIcon, ClosedEyeIcon } from '../icons';

export function PasswordInput(props: InputProps): ReactElement {
  const { fullWidth } = props;
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  return (
    <span
      className={clsx('relative', {
        'w-full': fullWidth,
      })}
    >
      <Input {...props} type={showPassword ? 'text' : 'password'} />
      <button
        className="absolute right-1 top-0 w-6"
        onClick={handleShowPassword}
        type="button"
      >
        {showPassword ? (
          <EyeIcon width={24} height={20} />
        ) : (
          <ClosedEyeIcon width={24} height={20} />
        )}
      </button>
    </span>
  );
}
