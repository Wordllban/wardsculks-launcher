import {
  useState,
  useEffect,
  useMemo,
  createContext,
  ReactNode,
  ReactElement,
  useCallback,
} from 'react';
import ErrorsList from './ErrorList';
import { ILauncherLog } from '../../../types';

// todo: error context to logger context

interface ILauncherLogsContext {
  showMessage: (error: Omit<ILauncherLog, 'id'>) => void;
}

export const LoggerContext = createContext<ILauncherLogsContext>({
  showMessage: (error: Omit<ILauncherLog, 'id'>) => error,
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
      setMessages([{ ...message, id: messages.length }, ...messages]);
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
      <ErrorsList errors={messages} setErrors={setMessages} />
    </LoggerContext.Provider>
  );
}

export default LoggerContextProvider;
