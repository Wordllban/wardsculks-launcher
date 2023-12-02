import { InputHTMLAttributes, ReactElement, useState } from 'react';
import clsx from 'clsx';

export type InputProps = {
  fullWidth?: boolean;
  errorMessage?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps): ReactElement {
  const {
    name,
    placeholder,
    type,
    onChange,
    minLength = 0,
    maxLength = 999,
    pattern,
    required = false,
    fullWidth = false,
    errorMessage,
    className,
  } = props;

  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <span className={clsx('flex flex-col', { 'w-full': fullWidth })}>
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
      {errorMessage ? (
        <span data-error className="block pt-1 text-xs font-light">
          {errorMessage}
        </span>
      ) : null}
    </span>
  );
}
