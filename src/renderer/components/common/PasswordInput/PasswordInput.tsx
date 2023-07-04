import { useState, ReactElement } from 'react';
import { Input, InputProps } from '../Input';
import closedEyeIcon from '../../../../../assets/icons/closed-eye.svg';
import eyeIcon from '../../../../../assets/icons/eye.svg';

export function PasswordInput(props: InputProps): ReactElement {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  return (
    <span className="relative">
      <Input {...props} type={showPassword ? 'text' : 'password'} />
      <button
        className="absolute right-1 top-5 w-6"
        onClick={handleShowPassword}
        type="button"
      >
        <img src={showPassword ? eyeIcon : closedEyeIcon} alt="show password" />
      </button>
    </span>
  );
}
