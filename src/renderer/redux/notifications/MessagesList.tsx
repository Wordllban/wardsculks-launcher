import { useState, useEffect, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { ILauncherLog, LauncherLogs } from '../../../types';
import { AppState } from '../store';
import { addNotification, removeNotification } from './notifications.slice';
import { CloseIcon } from '../../components/common/icons';

const DEFAULT_MESSAGE_LIFE_TIME: number = 10000;

/**
 * Hook for handling notification life cycle.
 */
const useNotificationLifeCycle = (destroyHandler: () => void) => {
  const [isHovered, setIsHovered] = useState(false);

  // self-destroy
  useEffect(() => {
    // do not destroy message when it's hovered
    if (isHovered) return;

    const timer = setTimeout(destroyHandler, DEFAULT_MESSAGE_LIFE_TIME);

    return () => {
      clearTimeout(timer);
    };
  }, [isHovered]);

  return setIsHovered;
};

type MessageProps = {
  message?: string;
  removeMessage: () => void;
};

function Error(props: MessageProps & { nativeError?: string }): ReactElement {
  const { t } = useTranslation();
  const { message, nativeError, removeMessage } = props;
  const [showNativeError, setShowNativeError] = useState<boolean>(false);

  const onMouse = useNotificationLifeCycle(removeMessage);

  /**
   * we are receiving native errors as unserialized string
   * because of IPC restrictions
   * so we are serializing it back to object
   */
  const parsedNativeError = nativeError ? JSON.parse(nativeError) : {};
  const nativeErrorKeys = parsedNativeError
    ? Object.keys(parsedNativeError)
    : [];

  return (
    <div
      className="relative select-text"
      onMouseEnter={() => onMouse(true)}
      onMouseLeave={() => onMouse(false)}
    >
      <div
        className={clsx(
          'z-[100] min-w-[210px]  p-2',
          'animate-opacity overflow-x-hidden transition-opacity duration-1000',
          'whitespace-normal border-2 border-solid border-red-700 bg-wall',
          showNativeError ? 'max-h-[360px] max-w-[720px]' : 'max-w-[360px]'
        )}
      >
        {message}
        {nativeError ? (
          <div className="text-xs">
            <button
              onClick={() => setShowNativeError(!showNativeError)}
              type="button"
            >
              {t(!showNativeError ? 'SHOW_NATIVE_ERROR' : 'HIDE_NATIVE_ERROR')}
            </button>
            {showNativeError ? (
              <ul className="mt-4 max-w-[360px]">
                {nativeErrorKeys.map((errorKey: string) => {
                  return (
                    <li className="text-wrap" key={errorKey}>
                      {errorKey}: <span>{parsedNativeError[errorKey]}</span>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
      <button
        onClick={removeMessage}
        className="absolute right-3 top-[-0.5rem] z-[150]"
        type="button"
      >
        <CloseIcon width={20} height={20} />
      </button>
    </div>
  );
}

function Log(props: MessageProps): ReactElement {
  const { message, removeMessage } = props;

  const onMouse = useNotificationLifeCycle(removeMessage);

  return (
    <div
      className="relative select-text"
      onMouseEnter={() => onMouse(true)}
      onMouseLeave={() => onMouse(false)}
    >
      <div
        className="z-[100] min-w-[210px] max-w-[360px] animate-opacity
     overflow-x-hidden border-2 border-solid border-main bg-wall p-2 transition-opacity duration-1000"
      >
        {message}
      </div>
      <button
        onClick={removeMessage}
        className="absolute right-3 top-[-0.5rem] z-[150]"
        type="button"
      >
        <CloseIcon width={20} height={20} />
      </button>
    </div>
  );
}

function Warning(props: MessageProps): ReactElement {
  const { message, removeMessage } = props;

  const onMouse = useNotificationLifeCycle(removeMessage);

  return (
    <div
      className="relative select-text"
      onMouseEnter={() => onMouse(true)}
      onMouseLeave={() => onMouse(false)}
    >
      <div
        className="z-[100] min-w-[210px] max-w-[360px] animate-opacity
     overflow-x-hidden border-2 border-solid border-orange-500 bg-wall p-2 transition-opacity duration-1000"
      >
        {message}
      </div>
      <button
        onClick={removeMessage}
        className="absolute right-3 top-[-0.5rem] z-[150]"
        type="button"
      >
        <CloseIcon width={20} height={20} />
      </button>
    </div>
  );
}

function MessagesList(): ReactElement {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const messages = useSelector(
    (state: AppState) => state.notifications.messages
  );

  window.electron.ipcRenderer.on('logger', (message: ILauncherLog) => {
    dispatch(addNotification(message));
  });

  return (
    <div className="absolute bottom-2 right-2 max-h-[85vh] overflow-y-auto pt-4">
      <div className="flex w-[380px] flex-col gap-4 transition-all">
        {messages.length > 0
          ? messages.map(({ id, message, key, nativeError, type }) => {
              const removeMessage = () => {
                dispatch(removeNotification(id));
              };

              const messageText = key ? t(key) : message;

              switch (type) {
                case LauncherLogs.error:
                  return (
                    <Error
                      key={`${id}-error`}
                      message={messageText}
                      nativeError={nativeError}
                      removeMessage={removeMessage}
                    />
                  );
                case LauncherLogs.warning:
                  return (
                    <Warning
                      key={`${id}-warning`}
                      message={messageText}
                      removeMessage={removeMessage}
                    />
                  );
                default:
                  return (
                    <Log
                      key={`${id}-log`}
                      message={messageText}
                      removeMessage={removeMessage}
                    />
                  );
              }
            })
          : null}
      </div>
    </div>
  );
}

export default MessagesList;
