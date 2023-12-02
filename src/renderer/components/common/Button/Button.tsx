/* eslint-disable react/button-has-type */
import clsx from 'clsx';
import {
  ClassAttributes,
  ButtonHTMLAttributes,
  ReactElement,
  ReactNode,
  forwardRef,
  ForwardedRef,
} from 'react';

type Props = {
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  ClassAttributes<HTMLButtonElement>;

const Button = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLButtonElement>): ReactElement => {
    const { children, className } = props;
    return (
      <button
        {...props}
        className={clsx(
          'border-4 border-solid border-main bg-wall bg-no-repeat object-cover shadow-default outline-none transition-all',
          'hover:glow-text hover:text-main hover:shadow-[0_0_20px_2px_theme(colors.main)] focus-visible:shadow-[0_0_20px_2px_theme(colors.main)]',
          'active:border-cyan-650 active:text-cyan-650 active:shadow-none',
          className
        )}
        ref={ref}
      >
        <span className="block pt-[5px]">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
