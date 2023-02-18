import { FC } from 'react';

type Props = {
  leftSide: string;
  rightSide: string;
  backgroundImage: string;
};

const Layout: FC = () => {
  return (
    <div className="bg-main">
      <div className="h-screen bg-no-repeat bg-[url('../../assets/images/wall-left.png'),_url('../../assets/images/wall-right.png')] bg-[position:left,_right]">
        <div>input</div>
        <div>button</div>
      </div>
    </div>
  );
};

export default Layout;
