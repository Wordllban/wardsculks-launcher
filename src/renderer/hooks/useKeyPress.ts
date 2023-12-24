import { useEffect, useRef } from 'react';

type KeyPressEventListener = (_event: KeyboardEvent) => void;

export const useKeyPress = (key: string, handler: KeyPressEventListener) => {
  const eventListenerRef = useRef<KeyPressEventListener>(handler);

  useEffect(() => {
    eventListenerRef.current = (event: KeyboardEvent) => {
      if (event.key === key) {
        handler?.(event);
      }
    };
  }, [key, handler]);

  useEffect(() => {
    const eventListener = (event: KeyboardEvent): void => {
      eventListenerRef.current(event);
    };
    window.addEventListener('keydown', eventListener);
    return () => {
      window.removeEventListener('keydown', eventListener);
    };
  }, []);
};
