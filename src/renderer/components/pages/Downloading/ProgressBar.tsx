import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { FINISHED_PROGRESS } from './constants';

type Props = {
  progress: number;
};

export function ProgressBar(props: Props): ReactElement {
  const { progress } = props;
  const { t } = useTranslation();

  const progressText =
    progress < FINISHED_PROGRESS ? `${progress} %` : t('LAUNCHING_GAME');

  return (
    <div className="w-full border-4 border-cyan-900 bg-black/60 px-3 py-4">
      <div className="relative flex w-full items-center justify-center">
        <progress
          max="100"
          value={progress}
          className="h-12 w-full border-4 border-main bg-[#272727] mix-blend-screen"
        />
        <span className="absolute mt-2 flex h-full items-center text-3xl text-main mix-blend-difference">
          {progressText}
        </span>
      </div>
    </div>
  );
}
