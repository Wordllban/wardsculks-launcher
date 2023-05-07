import { useNavigate } from 'react-router-dom';
import { KeyboardEvent, ReactElement, useCallback } from 'react';
import { useKeyPress } from 'renderer/hooks/useKeyPress';
import arrowIcon from '../../../../../assets/icons/arrow-back.svg';
/**
 * Common component for navigation to previous screen
 */
export function ArrowBack(): ReactElement {
  const navigate = useNavigate();

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useKeyPress('Escape', handleGoBack);

  return (
    <span
      onClick={handleGoBack}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(event: KeyboardEvent) => {
        if (event.key === 'Enter') handleGoBack();
      }}
    >
      <img src={arrowIcon} alt="arrow back" />
    </span>
  );
}
