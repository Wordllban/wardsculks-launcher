import {
  ClassAttributes,
  InputHTMLAttributes,
  ReactNode,
  ReactElement,
  useState,
  forwardRef,
  ForwardedRef,
  FocusEvent,
  useCallback,
} from 'react';
import clsx from 'clsx';

export type InputProps = {
  children?: ReactNode;
  fullWidth?: boolean;
  errorMessage?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement> &
  ClassAttributes<HTMLInputElement>;

const Input = forwardRef(
  (props: InputProps, ref: ForwardedRef<HTMLInputElement>): ReactElement => {
    const {
      name,
      placeholder,
      type,
      onChange,
      onBlur,
      minLength = 0,
      maxLength = 999,
      pattern,
      children,
      required = false,
      fullWidth = false,
      errorMessage,
      className,
    } = props;

    const [isFocused, setIsFocused] = useState<boolean>(false);

    const handleBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
      if (onBlur) onBlur(event);
      setIsFocused(true);
    }, []);

    return (
      <span className={clsx('flex flex-col', { 'w-full': fullWidth })}>
        <input
          name={name}
          placeholder={placeholder}
          type={type}
          onChange={onChange}
          onBlur={handleBlur}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          className={clsx('border-b-2 border-main pl-1 pt-1 ', className)}
          // data attribute for styles
          data-focused={isFocused}
          ref={ref}
        />
        {children || null}
        {errorMessage ? (
          <span data-error className="block pt-1 text-xs font-light">
            {errorMessage}
          </span>
        ) : null}
      </span>
    );
  }
);

Input.displayName = 'Input';

export default Input;
