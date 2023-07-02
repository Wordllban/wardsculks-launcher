import { ReactElement } from 'react';

type Props = {
  progress: number;
};

export function ProgressBar(props: Props): ReactElement {
  const { progress } = props;
  return (
    <div className="flex w-full items-center border-4 border-cyan-900 bg-black/60 px-3 py-4">
      <progress
        max="100"
        value={progress}
        className="h-11 w-full border-4 border-main bg-[#272727]"
      />
    </div>
  );
}
