import { ReactElement, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { Checkbox, ImageWithFallback } from '../../common';
import wardenHeadIcon from '../../../../../assets/icons/warden-head.png';
import { AppDispatch, selectMod } from '../../../redux';

type ModProps = {
  id: number;
  name: string;
  description: string;
  isChecked: boolean;
  onCheck?: () => void;
  icon?: string;
};

function Mod(props: ModProps): ReactElement {
  const { id, name, description, isChecked, icon, onCheck } = props;
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const textBlockRef = useRef<HTMLDivElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleCheck = () => {
    if (onCheck) onCheck();
    dispatch(selectMod(id));
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (textBlockRef.current) {
      const isOverflowing =
        textBlockRef.current.scrollHeight > textBlockRef.current.clientHeight;
      setShowButton(isOverflowing);
    }
  }, [textBlockRef]);

  return (
    <div
      className={clsx(
        'flex grow items-start gap-2 bg-black/50 p-2 transition-colors',
        'border-4 border-solid border-cyan-650 hover:border-main',
        isExpanded ? 'max-h-none' : 'max-h-[124px]'
      )}
    >
      <div className="flex max-h-[100px] w-[calc(20%)] min-w-[100px] items-center bg-black/50">
        <ImageWithFallback
          src={icon}
          alt="mod icon"
          fallback={wardenHeadIcon}
          className="max-h-[100px] object-contain"
        />
      </div>
      <div className="w-[calc(80%)] overflow-hidden text-ellipsis py-1">
        <div className="flex items-center justify-between">
          <h5 className="text-main">{name}</h5>
          <Checkbox
            className="mr-2"
            onChange={handleCheck}
            checked={isChecked}
          />
        </div>
        <div
          className={clsx(
            isExpanded ? 'max-h-none' : 'max-h-[50px] sm:line-clamp-2',
            'overflow-hidden text-ellipsis text-sm'
          )}
          ref={textBlockRef}
        >
          {description}
        </div>
        {showButton ? (
          <button
            onClick={handleExpand}
            type="button"
            className="mt-auto transition-colors hover:text-main"
          >
            {isExpanded ? t('HIDE') : t('SHOW_MORE')}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default Mod;
