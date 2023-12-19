import { useNavigate } from 'react-router-dom';
import { KeyboardEvent, ReactElement, useState } from 'react';
import clsx from 'clsx';
import { useKeyPress } from '../../../hooks/useKeyPress';
import ConfirmationWindow from '../ConfirmationWindow/ConfirmationWindow';
import { ArrowIcon } from '../icons';

type Props = {
  position?: string;
  hasConfirmation?: boolean;
  confirmationWindowTitle?: string;
  confirmationWindowDescription?: string;
  disabled?: boolean;
  navigateTo?: string;
};

/**
 * Common component for navigation to previous screen
 */
export function ArrowBack(props: Props): ReactElement {
  const {
    position,
    hasConfirmation,
    confirmationWindowTitle,
    confirmationWindowDescription,
    disabled = false,
    navigateTo = '/main-menu',
  } = props;
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleGoBack = () => {
    if (hasConfirmation && !showConfirmation) {
      return setShowConfirmation(true);
    }
    return navigate(navigateTo);
  };

  useKeyPress('Escape', handleGoBack);

  return (
    <>
      <button
        onClick={handleGoBack}
        className={clsx(
          'window-menu-button flex h-10 w-11 cursor-pointer items-center p-4 hover:bg-main/30',
          position
        )}
        tabIndex={0}
        onKeyDown={(event: KeyboardEvent) => {
          if (event.key === 'Enter') handleGoBack();
        }}
        type="button"
        disabled={disabled}
        aria-label="Back"
      >
        <ArrowIcon />
      </button>
      {showConfirmation && (
        <ConfirmationWindow
          handleConfirmation={handleGoBack}
          handleRejection={() => setShowConfirmation(false)}
          title={confirmationWindowTitle}
          description={confirmationWindowDescription}
        />
      )}
    </>
  );
}
