import clsx from 'clsx';
import { ButtonHTMLAttributes, ReactElement } from 'react';

type Props = {
  title: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: Props): ReactElement {
  const { title, type, className } = props;
  return (
    <button
      className={clsx(
        'border-default bg-wall bg-no-repeat object-cover shadow-default outline-none transition-all first-letter:uppercase',
        'focus:glow-text hover:text-main focus:text-main focus:shadow-[0_0_20px_2px_theme(colors.main)]',
        className
      )}
      type={type}
    >
      {title}
    </button>
  );
}
