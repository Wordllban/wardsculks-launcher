import { InputHTMLAttributes, ReactElement } from 'react';
import clsx from 'clsx';

type Props = {
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input(props: Props): ReactElement {
  const { className } = props;
  return (
    <input
      {...props}
      className={clsx('border-b-2 border-main pl-1 pt-1', className)}
    />
  );
}
