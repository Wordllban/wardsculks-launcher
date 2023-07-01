import clsx from 'clsx';
import { useState, ReactElement, useEffect } from 'react';
import arrowIcon from '../../../../../assets/icons/arrow.svg';

export interface IDropdownItem {
  title: string;
  name?: string;
  description?: string;
}

type Props<T extends IDropdownItem> = {
  onSelect: (item: T) => void;
  items: T[];
  defaultValue?: T;
};

export function Dropdown<T extends IDropdownItem>(
  props: Props<T>
): ReactElement {
  const { items, defaultValue, onSelect } = props;

  const [selected, setSelected] = useState<T | undefined>(defaultValue);
  const [isOpen, setIsOpen] = useState<boolean>();

  const handleSelect = (item: T) => {
    onSelect(item);
    setSelected(item);
    setIsOpen(false);
  };

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="flex flex-col text-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center gap-2"
      >
        <span className="w-[140px] bg-black/80 px-2 py-1 text-start">
          {selected?.title}
        </span>
        <img
          src={arrowIcon}
          alt="close-open"
          className={isOpen ? 'rotate-[-90deg]' : 'rotate-90'}
        />
      </button>
      {isOpen ? (
        <div className="relative">
          <div className="absolute flex flex-col bg-black/80">
            {items.map((item: T) => (
              <button
                className={clsx(
                  {
                    'bg-slate-800': item.title === selected?.title,
                  },
                  'flex w-[140px] justify-start px-2 py-1'
                )}
                onClick={() => handleSelect(item)}
                key={`${item.title}-server`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
