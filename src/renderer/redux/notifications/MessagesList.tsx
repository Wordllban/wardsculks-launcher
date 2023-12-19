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
const useNotificationLifeCycle = (
  destroyHandler: () => void,
  lifetime: number
) => {
  const [isHovered, setIsHovered] = useState(false);

  // self-destroy
  useEffect(() => {
    // do not destroy message when it's hovered
    if (isHovered) return;

    const timer = setTimeout(destroyHandler, lifetime);

    return () => {
      clearTimeout(timer);
    };
  }, [isHovered]);

  return setIsHovered;
};

type MessageProps = {
  // in ms
  lifetime?: number;
  message?: string;
  removeMessage: () => void;
};

function Error(props: MessageProps & { nativeError?: string }): ReactElement {
  const { t } = useTranslation();
  const {
    lifetime = DEFAULT_MESSAGE_LIFE_TIME,
    message,
    nativeError,
    removeMessage,
  } = props;
  const [showNativeError, setShowNativeError] = useState<boolean>(false);

  const onMouse = useNotificationLifeCycle(removeMessage, lifetime);

  const safeParseJson = (error: string) => {
    try {
      return JSON.parse(error);
    } catch (e) {
      // If JSON.parse() fails, return the original string
      return nativeError;
    }
  };

  /**
   * sometimes we are receiving native errors using JSON.stringify()
   * because of IPC restrictions
   * so we are parsing it back to object
   */
  const parsedNativeError = nativeError ? safeParseJson(nativeError) : {};
  const nativeErrorKeys =
    typeof parsedNativeError === 'object' ? Object.keys(parsedNativeError) : [];

  return (
    <div
      className="relative select-text"
      onMouseEnter={() => onMouse(true)}
      onMouseLeave={() => onMouse(false)}
    >
      <div
        className={clsx(
          'z-[100] min-w-[210px]  p-2',
          'animate-opacity overflow-x-hidden transition-all duration-1000',
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
                {nativeErrorKeys.length ? (
                  nativeErrorKeys.map((errorKey: string) => {
                    return (
                      <li className="text-wrap" key={errorKey}>
                        {errorKey}: <span>{parsedNativeError[errorKey]}</span>
                      </li>
                    );
                  })
                ) : (
                  <li className="text-wrap">
                    <span>{nativeError}</span>
                  </li>
                )}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
      <button
        onClick={removeMessage}
        className="absolute right-3 top-[-0.5rem] z-[150]"
        type="button"
        aria-label="Close"
      >
        <CloseIcon width={20} height={20} />
      </button>
    </div>
  );
}

function Log(props: MessageProps): ReactElement {
  const {
    lifetime = DEFAULT_MESSAGE_LIFE_TIME,
    message,
    removeMessage,
  } = props;

  const onMouse = useNotificationLifeCycle(removeMessage, lifetime);

  return (
    <div
      className="relative select-text"
      onMouseEnter={() => onMouse(true)}
      onMouseLeave={() => onMouse(false)}
    >
      <div
        className="z-[100] min-w-[210px] max-w-[360px] animate-opacity
     overflow-x-hidden border-2 border-solid border-main bg-wall p-2 transition-all duration-1000"
      >
        {message}
      </div>
      <button
        onClick={removeMessage}
        className="absolute right-3 top-[-0.5rem] z-[150]"
        type="button"
        aria-label="Close"
      >
        <CloseIcon width={20} height={20} />
      </button>
    </div>
  );
}

function Warning(props: MessageProps): ReactElement {
  const {
    lifetime = DEFAULT_MESSAGE_LIFE_TIME,
    message,
    removeMessage,
  } = props;

  const onMouse = useNotificationLifeCycle(removeMessage, lifetime);

  return (
    <div
      className="relative select-text"
      onMouseEnter={() => onMouse(true)}
      onMouseLeave={() => onMouse(false)}
    >
      <div
        className="z-[100] min-w-[210px] max-w-[360px] animate-opacity
     overflow-x-hidden border-2 border-solid border-orange-500 bg-wall p-2 transition-all duration-1000"
      >
        {message}
      </div>
      <button
        onClick={removeMessage}
        className="absolute right-3 top-[-0.5rem] z-[150]"
        type="button"
        aria-label="Close"
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
          ? messages.map(
              ({ id, message, key, nativeError, type, lifetime }) => {
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
                        lifetime={lifetime}
                      />
                    );
                  case LauncherLogs.warning:
                    return (
                      <Warning
                        key={`${id}-warning`}
                        message={messageText}
                        removeMessage={removeMessage}
                        lifetime={lifetime}
                      />
                    );
                  default:
                    return (
                      <Log
                        key={`${id}-log`}
                        message={messageText}
                        removeMessage={removeMessage}
                        lifetime={lifetime}
                      />
                    );
                }
              }
            )
          : null}
      </div>
    </div>
  );
}

export default MessagesList;
