import { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  children: ReactNode;
  mainBackground: string;
  sideBackground?: string;
};

function Layout({
  children,
  mainBackground,
  sideBackground = '',
}: Props): ReactElement {
  return (
    <div className={clsx('screen-container', mainBackground)}>
      <div
        className={clsx(
          'h-screen',
          'bg-no-repeat',
          'bg-[position:left,_right]',
          sideBackground
        )}
      >
        {children}
      </div>
    </div>
  );
}

Layout.defaultProps = {
  sideBackground: '',
};

export default Layout;
