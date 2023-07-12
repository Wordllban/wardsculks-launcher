import {
  useState,
  useEffect,
  useMemo,
  createContext,
  ReactNode,
  ReactElement,
  useCallback,
} from 'react';
import { v4 as uuid } from 'uuid';
import MessagesList from './MessagesList';
import { ILauncherLog } from '../../../types';

interface ILauncherLogsContext {
  showMessage: (message: Omit<ILauncherLog, 'id'>) => void;
}

export const LoggerContext = createContext<ILauncherLogsContext>({
  showMessage: (message: Omit<ILauncherLog, 'id'>) => message,
});

type Props = {
  children: ReactNode;
};

function LoggerContextProvider(props: Props): ReactElement {
  const { children } = props;

  const [messages, setMessages] = useState<ILauncherLog[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messages.length > 0) {
        const updatedErrors = [...messages];
        updatedErrors.pop();
        setMessages(updatedErrors);
      }
    }, 12000);

    return () => {
      clearInterval(timer);
    };
  }, [messages]);

  const showMessage = useCallback(
    (message: Omit<ILauncherLog, 'id'>) => {
      setMessages([{ ...message, id: uuid() }, ...messages]);
    },
    [messages]
  );

  const contextValue = useMemo(
    () => ({
      showMessage,
    }),
    [showMessage]
  );

  window.electron.ipcRenderer.on('logger', (message: ILauncherLog) => {
    showMessage(message);
  });

  return (
    <LoggerContext.Provider value={contextValue}>
      {children}
      <MessagesList messages={messages} setMessages={setMessages} />
    </LoggerContext.Provider>
  );
}

export default LoggerContextProvider;
