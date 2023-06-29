import clsx from 'clsx';
import { ReactElement, InputHTMLAttributes } from 'react';

type Props = {
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Checkbox(props: Props): ReactElement {
  const { checked = false, disabled, className, onClick, onChange } = props;

  return (
    <label
      className={clsx(
        'relative flex h-[15px] w-[15px] border-[3px] border-main bg-neutral-950',
        {
          'cursor-not-allowed': disabled,
        },
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        onClick={onClick}
        disabled={disabled}
      />
      {checked && (
        <span
          className="absolute h-[3px] w-[3px]
         shadow-[0_3px_theme(colors.main),_3px_6px_theme(colors.main),_6px_3px_theme(colors.main),_9px_0px_theme(colors.main),_0_2px_12px_4px_theme(colors.main)]"
        />
      )}
    </label>
  );
}
