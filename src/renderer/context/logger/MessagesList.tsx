import { useState, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { ILauncherLog, LauncherLogs } from '../../../types';
import closeIcon from '../../../../assets/icons/close.svg';

type MessageProps = {
  id: string;
  message: string;
  removeMessage: (id: string) => void;
};

function Error(props: MessageProps & { nativeError?: unknown }): ReactElement {
  const { t } = useTranslation();
  const { id, message, nativeError, removeMessage } = props;
  const [showNativeError, setShowNativeError] = useState<boolean>(false);
  return (
    <div className="relative">
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
              <div className="flex">{`${nativeError}`}</div>
            ) : null}
          </div>
        ) : null}
      </div>
      <button
        onClick={() => removeMessage(id)}
        className="absolute right-3 top-[-0.5rem] z-50"
        type="button"
      >
        <img src={closeIcon} alt="close" width={20} height={20} />
      </button>
    </div>
  );
}

function Log(props: MessageProps): ReactElement {
  const { id, message, removeMessage } = props;
  return (
    <div className="relative">
      <div
        className="z-10 min-w-[210px] max-w-[360px] animate-opacity
     overflow-x-hidden border-2 border-solid border-main bg-wall p-2 transition-opacity duration-1000"
      >
        {message}
      </div>
      <button
        onClick={() => removeMessage(id)}
        className="absolute right-3 top-[-0.5rem] z-50"
        type="button"
      >
        <img src={closeIcon} alt="close" width={20} height={20} />
      </button>
    </div>
  );
}

function Warning(props: MessageProps): ReactElement {
  const { id, message, removeMessage } = props;
  return (
    <div className="relative">
      <div
        className="z-10 min-w-[210px] max-w-[360px] animate-opacity
     overflow-x-hidden border-2 border-solid border-orange-500 bg-wall p-2 transition-opacity duration-1000"
      >
        {message}
      </div>
      <button
        onClick={() => removeMessage(id)}
        className="absolute right-3 top-[-0.5rem] z-50"
        type="button"
      >
        <img src={closeIcon} alt="close" width={20} height={20} />
      </button>
    </div>
  );
}

type MessagesListProps = {
  messages: ILauncherLog[];
  setMessages: (message: ILauncherLog[]) => void;
};
function MessagesList(props: MessagesListProps): ReactElement {
  const { messages, setMessages } = props;

  const removeMessage = (id: string) => {
    const newMessages = messages.filter((message) => message.id !== id);
    setMessages(newMessages);
  };

  return (
    <div className="absolute bottom-2 right-2 max-h-[85vh] overflow-y-auto pt-4">
      <div className="flex w-[380px] flex-col gap-4 transition-all">
        {messages.length > 0
          ? messages.map(({ id, message, nativeError, type }) => {
              switch (type) {
                case LauncherLogs.error:
                  return (
                    <Error
                      key={`${id}-error`}
                      id={id}
                      message={message}
                      nativeError={nativeError}
                      removeMessage={removeMessage}
                    />
                  );
                case LauncherLogs.warning:
                  return (
                    <Warning
                      key={`${id}-warning`}
                      id={id}
                      message={message}
                      removeMessage={removeMessage}
                    />
                  );
                default:
                  return (
                    <Log
                      key={`${id}-log`}
                      id={id}
                      message={message}
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
