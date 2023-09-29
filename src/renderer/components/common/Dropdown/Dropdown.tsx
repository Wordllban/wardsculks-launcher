import clsx from 'clsx';
import { useState, ReactElement, useEffect, KeyboardEvent } from 'react';
import { ArrowIcon } from '../icons';

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
  const handleSelectKeyboard = (
    event: KeyboardEvent<HTMLLIElement>,
    item: T
  ) => {
    if (event.key === 'Enter') handleSelect(item);
  };

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  const handleOpen = () => setIsOpen(!isOpen);
  const handleOpenKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') handleOpen();
  };

  return (
    <div className="flex flex-col text-sm" role="button">
      <div
        onClick={handleOpen}
        onKeyDown={handleOpenKeyboard}
        className="flex w-[140px] cursor-pointer items-center justify-between gap-2 bg-black/80 px-2 py-1 text-start"
        tabIndex={0}
        role="button"
      >
        {selected?.title}
        <ArrowIcon className={isOpen ? 'rotate-[-90deg]' : 'rotate-90'} />
      </div>
      {isOpen ? (
        <div className="relative">
          <ul className="absolute flex flex-col bg-black/80" role="listbox">
            {items.map((item: T) => (
              <li
                className={clsx(
                  {
                    'bg-slate-800': item.title === selected?.title,
                  },
                  'focus: flex w-[140px] justify-start px-2 py-1'
                )}
                onClick={() => handleSelect(item)}
                onKeyDown={(event: KeyboardEvent<HTMLLIElement>) =>
                  handleSelectKeyboard(event, item)
                }
                key={`${item.title}-server`}
                tabIndex={-1}
                role="option"
                aria-selected={selected?.title === item.title}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
