import {
  useState,
  ReactElement,
  InputHTMLAttributes,
  ChangeEvent,
} from 'react';
import clsx from 'clsx';

type Props = {
  onChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  initialValue?: number | string;
  options?: number[];
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function InputRange(props: Props): ReactElement {
  const {
    options,
    min = 1,
    max = 32,
    step = 1,
    initialValue,
    onChangeHandler,
    className,
  } = props;

  const [value, setValue] = useState<string | number>(
    max ? Number(max) / 2 : 2
  );

  return (
    <div className="relative flex flex-col">
      {options && (
        <datalist
          id="memory"
          className="relative flex w-[320px] justify-between [&>*:nth-child(2)]:ml-[-8px]"
        >
          {options.map((option: number) => (
            <option
              key={`datalist-option-${option}`}
              className={clsx('w-3 p-0 text-center')}
            >
              {option}
            </option>
          ))}
        </datalist>
      )}
      <div className="relative">
        <span className="glow-text absolute left-[-4.75rem] top-[-0.25rem] w-20 text-main">
          {initialValue || value} GB
        </span>
        <div className="flex items-center justify-center">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            className={clsx('w-[325px]', className)}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (onChangeHandler) onChangeHandler(event);
              setValue(event.target.value);
            }}
            list="memory"
            value={initialValue || value}
          />
        </div>
      </div>
    </div>
  );
}
