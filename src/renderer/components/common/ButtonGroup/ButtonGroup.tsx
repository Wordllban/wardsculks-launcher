import { ReactElement, useState, useEffect, KeyboardEvent } from 'react';
import clsx from 'clsx';

export interface IMenuGroupItem {
  text: string;
}

type MenuGroupProps<T extends IMenuGroupItem> = {
  items: T[];
  onSelect: (item: T) => void;
  defaultValue?: T;
  align?: 'items-end' | 'items-start' | 'items-center';
};

export function MenuGroup<T extends IMenuGroupItem>(
  props: MenuGroupProps<T>
): ReactElement {
  const { items, defaultValue, align, onSelect } = props;

  const [selected, setSelected] = useState<T | undefined>();

  const handleClick = (item: T) => {
    onSelect(item);
    setSelected(item);
  };

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  return (
    <menu
      className={clsx('flex cursor-pointer flex-col items-end gap-2', align)}
    >
      {items.map((item: T) => (
        <li key={item.text}>
          <button
            className={clsx(
              'border-b-2 pl-2 text-right transition-all hover:text-main',
              selected?.text === item.text
                ? 'glow-text border-main text-main'
                : 'border-transparent'
            )}
            onClick={() => handleClick(item)}
            onKeyDown={(event: KeyboardEvent) => {
              if (event.key === 'Enter') handleClick(item);
            }}
            type="button"
          >
            {item.text}
          </button>
        </li>
      ))}
    </menu>
  );
}
