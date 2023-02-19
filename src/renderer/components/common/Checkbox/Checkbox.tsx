import clsx from 'clsx';
import { ReactElement, useState } from 'react';

type Props = {
  className?: string;
  onClickCB?: () => void;
};

export function Checkbox(props: Props): ReactElement {
  const { className, onClickCB } = props;

  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <label
      className={clsx(
        'relative flex h-[15px] w-[15px] border-[3px] border-main bg-neutral-950',
        className
      )}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => {
          if (onClickCB) onClickCB();
          setIsChecked(!isChecked);
        }}
      />
      {isChecked && (
        <span
          className="absolute h-[3px] w-[3px]
         shadow-[0_3px_theme(colors.main),_3px_6px_theme(colors.main),_6px_3px_theme(colors.main),_9px_0px_theme(colors.main),_0_2px_12px_4px_theme(colors.main)]"
        />
      )}
    </label>
  );
}
