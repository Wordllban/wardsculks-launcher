import { useNavigate } from 'react-router-dom';
import { KeyboardEvent, ReactElement, useState, useCallback } from 'react';
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
  } = props;
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleGoBack = useCallback(() => {
    if (hasConfirmation && !showConfirmation) {
      return setShowConfirmation(true);
    }
    return navigate(-1);
  }, [navigate, hasConfirmation, showConfirmation]);

  useKeyPress('Escape', handleGoBack);

  return (
    <>
      <button
        onClick={handleGoBack}
        className={clsx('window-menu-button cursor-pointer p-4', position)}
        tabIndex={0}
        onKeyDown={(event: KeyboardEvent) => {
          if (event.key === 'Enter') handleGoBack();
        }}
        type="button"
        disabled={disabled}
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
