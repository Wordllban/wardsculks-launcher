import { HTMLInputTypeAttribute, ReactElement } from 'react';
import clsx from 'clsx';

type Props = {
  type: HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
};

export function Input(props: Props): ReactElement {
  const { type, placeholder, className } = props;
  return (
    <input
      className={clsx('border-b-2 border-main pl-1 pt-1', className)}
      placeholder={placeholder}
      type={type}
    />
  );
}
