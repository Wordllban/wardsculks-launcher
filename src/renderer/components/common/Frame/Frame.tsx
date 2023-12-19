import { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  className?: string;
  hasShadow?: boolean;
  border?: string;
  children: ReactNode;
};

export function Frame(props: Props): ReactElement {
  const { className, hasShadow = true, border, children } = props;

  return (
    <div
      className={clsx(
        ' bg-wall bg-center bg-no-repeat object-scale-down',
        border || 'border-4 border-solid border-main',
        { 'shadow-glow': hasShadow },
        className
      )}
    >
      {children}
    </div>
  );
}
