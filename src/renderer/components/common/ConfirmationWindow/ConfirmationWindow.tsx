import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { Frame } from '../Frame';

export type ConfirmationWindowProps = {
  title?: string;
  description?: string;
  handleConfirmation: () => void;
  handleRejection: () => void;
};

function ConfirmationWindow(props: ConfirmationWindowProps): ReactElement {
  const { title, description, handleConfirmation, handleRejection } = props;

  const { t } = useTranslation();

  return (
    <div
      className="absolute left-[50%] top-[50%] z-10 h-full w-full
       translate-x-[-50%] translate-y-[-50%] bg-black bg-opacity-[0.55]"
    >
      <Frame
        className="absolute left-[50%] top-[50%] flex
      translate-x-[-50%] translate-y-[-50%] flex-col
      items-start justify-start"
      >
        <div className="mx-12 my-8 flex w-[275px] flex-col gap-6 text-sm">
          <h4 className="text-start text-lg text-main">{title}</h4>
          {description}
          <div className="flex w-full items-center justify-between">
            <Button
              className="hover:glow-text px-8 py-2 text-main"
              onClick={handleConfirmation}
            >
              {t('YES')}
            </Button>
            <Button
              className="hover:glow-text px-8 py-2 text-main"
              onClick={handleRejection}
            >
              {t('NO')}
            </Button>
          </div>
        </div>
      </Frame>
    </div>
  );
}

export default ConfirmationWindow;
