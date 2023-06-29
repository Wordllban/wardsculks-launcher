import { useNavigate } from 'react-router-dom';
import { KeyboardEvent, ReactElement, useState, useCallback } from 'react';
import clsx from 'clsx';
import { useKeyPress } from '../../../hooks/useKeyPress';
import arrowIcon from '../../../../../assets/icons/arrow-back.svg';
import ConfirmationWindow from '../ConfirmationWindow/ConfirmationWindow';

type Props = {
  position?: string;
  hasConfirmation?: boolean;
  confirmationWindowTitle?: string;
  confirmationWindowDescription?: string;
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
      <span
        onClick={handleGoBack}
        className={clsx('cursor-pointer', position)}
        role="button"
        tabIndex={0}
        onKeyDown={(event: KeyboardEvent) => {
          if (event.key === 'Enter') handleGoBack();
        }}
      >
        <img src={arrowIcon} alt="arrow back" />
      </span>
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
