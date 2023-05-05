import { useNavigate } from 'react-router-dom';
import { ReactElement } from 'react';
import arrowIcon from '../../../../../assets/icons/arrrow-back.svg';
/**
 * Common component for navigation to previous screen
 */
export function ArrowBack(): ReactElement {
  const navigate = useNavigate();

  return (
    <span
      onClick={() => navigate(-1)}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
    >
      <img src={arrowIcon} alt="arrow back" />
    </span>
  );
}
