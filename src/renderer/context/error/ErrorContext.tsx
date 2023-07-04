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
import { ILauncherError } from '../../types';

interface ILauncherErrorsContext {
  showError: (error: Omit<ILauncherError, 'id'>) => void;
}

export const ErrorContext = createContext<ILauncherErrorsContext>({
  showError: (error: Omit<ILauncherError, 'id'>) => error,
});

type Props = {
  children: ReactNode;
};

function ErrorContextProvider(props: Props): ReactElement {
  const { children } = props;

  const [errors, setErrors] = useState<ILauncherError[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (errors.length > 0) {
        const updatedErrors = [...errors];
        updatedErrors.pop();
        setErrors(updatedErrors);
      }
    }, 12000);

    return () => {
      clearInterval(timer);
    };
  }, [errors]);

  const showError = useCallback(
    (error: Omit<ILauncherError, 'id'>) => {
      setErrors([{ ...error, id: errors.length }, ...errors]);
    },
    [errors]
  );

  const contextValue = useMemo(
    () => ({
      showError,
    }),
    [showError]
  );

  window.electron.ipcRenderer.on('error', (error: ILauncherError) => {
    showError(error);
  });

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
      <ErrorsList errors={errors} setErrors={setErrors} />
    </ErrorContext.Provider>
  );
}

export default ErrorContextProvider;
