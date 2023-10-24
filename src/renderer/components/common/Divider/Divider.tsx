import { ReactElement } from 'react';
import clsx from 'clsx';

type Props = {
  margin?: string;
};

export function Divider(props: Props): ReactElement {
  const { margin = 'mx-1' } = props;
  return <span className={clsx('border-l-[3px] border-main', margin)} />;
}
