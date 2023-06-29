import { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  children: ReactNode;
  mainBackground: string;
  sideBackground?: string;
};

export function Layout({
  children,
  mainBackground,
  sideBackground,
}: Props): ReactElement {
  return (
    <div
      className={clsx(
        'h-screen overflow-hidden bg-cover bg-no-repeat',
        mainBackground
      )}
    >
      <div
        className={clsx(
          'h-screen bg-[position:right,left] bg-no-repeat px-12 py-5',
          sideBackground
        )}
      >
        {children}
      </div>
    </div>
  );
}
