import {
  useState,
  ReactElement,
  InputHTMLAttributes,
  ChangeEvent,
} from 'react';
import clsx from 'clsx';

type Props = {
  onChangeHandler: (_event: ChangeEvent<HTMLInputElement>) => void;
  options?: number[];
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function InputRange(props: Props): ReactElement {
  const {
    options,
    min = 1,
    max = 32,
    step = 1,
    onChangeHandler,
    className,
  } = props;
  const [value, setValue] = useState<string | number>(
    max ? Number(max) / 2 : 2
  );
  console.log(max, value);

  return (
    <div className="relative flex flex-col">
      {options && (
        <datalist
          id="memory"
          className="relative flex w-[280px] justify-between"
        >
          {options.map((option: number, index) => (
            <option
              key={`datalist-option-${option}`}
              className={clsx(
                'w-6 p-0',
                options[2].toString().split('').length >= 2 && index > 2
                  ? 'text-right'
                  : index === 0
                  ? 'text-right'
                  : options[2].toString().split('').length >= 2 && index === 1
                  ? 'text-center'
                  : 'text-start'
              )}
            >
              {option}
            </option>
          ))}
        </datalist>
      )}
      <div className="relative">
        <span className="glow-text absolute left-[-4rem] top-[-0.25rem] w-20 text-main">
          {value} GB
        </span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          className={clsx('w-[285px]', className)}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            if (onChangeHandler) onChangeHandler(event);
            setValue(event.target.value);
          }}
          list="memory"
          value={value}
        />
      </div>
    </div>
  );
}
