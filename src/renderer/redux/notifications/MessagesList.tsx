import { useState, useEffect, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
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

function Error(props: MessageProps & { nativeError?: unknown }): ReactElement {
  const { t } = useTranslation();
  const { message, nativeError, removeMessage } = props;
  const [showNativeError, setShowNativeError] = useState<boolean>(false);

  const onMouse = useNotificationLifeCycle(removeMessage);

  return (
    <div
      className="relative"
      onMouseEnter={() => onMouse(true)}
      onMouseLeave={() => onMouse(false)}
    >
      <div
        className="z-10 min-w-[210px] max-w-[360px] animate-opacity
     overflow-x-hidden border-2 border-solid border-red-700 bg-wall p-2 transition-opacity duration-1000"
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
              <div className="text-wrap flex max-w-[360px]">{`${nativeError}`}</div>
            ) : null}
          </div>
        ) : null}
      </div>
      <button
        onClick={removeMessage}
        className="absolute right-3 top-[-0.5rem] z-50"
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
      className="relative"
      onMouseEnter={() => onMouse(true)}
      onMouseLeave={() => onMouse(false)}
    >
      <div
        className="z-10 min-w-[210px] max-w-[360px] animate-opacity
     overflow-x-hidden border-2 border-solid border-main bg-wall p-2 transition-opacity duration-1000"
      >
        {message}
      </div>
      <button
        onClick={removeMessage}
        className="absolute right-3 top-[-0.5rem] z-50"
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
      className="relative"
      onMouseEnter={() => onMouse(true)}
      onMouseLeave={() => onMouse(false)}
    >
      <div
        className="z-10 min-w-[210px] max-w-[360px] animate-opacity
     overflow-x-hidden border-2 border-solid border-orange-500 bg-wall p-2 transition-opacity duration-1000"
      >
        {message}
      </div>
      <button
        onClick={removeMessage}
        className="absolute right-3 top-[-0.5rem] z-50"
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
