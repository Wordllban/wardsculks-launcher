/* eslint jsx-a11y/no-static-element-interactions: off, jsx-a11y/click-events-have-key-events: off */
import clsx from 'clsx';
import { ReactNode, ReactElement, useState, useEffect } from 'react';

type Props = {
  // seconds
  children: ReactNode;
  timer: number;
  timerText?: string;
  timerTextHeight?: string;
  disableStart?: boolean;
  onTimerEnd?: () => void;
};

export function WithTimer(props: Props): ReactElement {
  const {
    timer,
    timerText,
    children,
    timerTextHeight,
    disableStart,
    onTimerEnd,
  } = props;

  const [secondsLeft, setSecondsLeft] = useState<number>(timer);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((seconds) => seconds - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      if (onTimerEnd) onTimerEnd();
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const startCountdown = () => {
    if (isActive || disableStart) return;
    setIsActive(true);
    setSecondsLeft(timer);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col text-sm">
      <div onClick={startCountdown}>{children}</div>
      <span className={clsx('mt-2', timerTextHeight)}>
        {isActive ? (
          <>
            {timerText}
            <span className="ml-1 text-main">{formatTime(secondsLeft)}</span>
          </>
        ) : null}
      </span>
    </div>
  );
}
