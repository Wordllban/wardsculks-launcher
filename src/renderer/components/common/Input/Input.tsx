import { InputHTMLAttributes, ReactElement, useState } from 'react';
import clsx from 'clsx';

type Props = {
  errorMessage?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input(props: Props): ReactElement {
  const {
    name,
    placeholder,
    type,
    onChange,
    minLength = 0,
    maxLength = 999,
    pattern,
    required = false,
    errorMessage,
    className,
  } = props;

  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <span>
      <input
        name={name}
        placeholder={placeholder}
        type={type}
        onChange={onChange}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        className={clsx('border-b-2 border-main pl-1 pt-1 ', className)}
        onBlur={() => setIsFocused(true)}
        // data attribute for styles
        data-focused={isFocused}
      />
      <span data-error className="pt-1 text-xs font-light">
        {errorMessage}
      </span>
    </span>
  );
}
