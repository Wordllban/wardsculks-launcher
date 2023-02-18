import { FC, ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  children: ReactNode;
  mainBackground: string;
  sideBackground?: string;
};

const Layout: FC<Props> = (props) => {
  const { children, mainBackground, sideBackground } = props;
  return (
    <div className={clsx('screen-container', mainBackground)}>
      <div
        className={`h-screen bg-no-repeat ${sideBackground} bg-[position:left,_right]`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
