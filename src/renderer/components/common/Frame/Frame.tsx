import { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  className?: string;
  children: ReactNode;
};

export function Frame(props: Props): ReactElement {
  const { className, children } = props;

  return (
    <div
      className={clsx(
        'border-default bg-wall bg-center bg-no-repeat object-scale-down shadow-glow',
        className
      )}
    >
      {children}
    </div>
  );
}
