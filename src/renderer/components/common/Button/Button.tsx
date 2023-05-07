import clsx from 'clsx';
import { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: Props): ReactElement {
  const { children, className } = props;
  return (
    <button
      {...props}
      className={clsx(
        'border-4 border-solid border-main bg-wall bg-no-repeat object-cover shadow-default outline-none transition-all',
        'focus:glow-text hover:text-main focus:text-main focus:shadow-[0_0_20px_2px_theme(colors.main)]',
        className
      )}
    >
      <span className="block pt-[5px]">{children}</span>
    </button>
  );
}
