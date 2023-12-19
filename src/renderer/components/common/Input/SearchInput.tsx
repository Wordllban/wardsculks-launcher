import { ReactElement, useRef, useState } from 'react';
import clsx from 'clsx';
import Input, { InputProps } from './Input';
import { SearchIcon } from '../icons';

type Props = {
  inputProps?: InputProps;
  width?: string;
};

export function SearchInput(props: Props): ReactElement {
  const { inputProps, width } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    inputRef.current?.focus();
  };

  return (
    <div className={clsx('relative flex flex-row justify-end')}>
      <Input
        {...inputProps}
        ref={inputRef}
        className={clsx(
          'absolute right-0 pr-5 duration-300',
          isExpanded ? width : 'w-0 border-transparent'
        )}
      >
        <button
          onClick={toggleSearch}
          className="z-10 flex items-center justify-center"
          type="button"
          aria-label="Expand search field"
        >
          <SearchIcon className="h-6 w-5" />
        </button>
      </Input>
    </div>
  );
}
