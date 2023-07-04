import { useState, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { ILauncherError } from '../../types';
import closeIcon from '../../../../assets/icons/close.svg';

type ErrorProps = ILauncherError & {
  removeError: (id: number) => void;
};

function Error(props: ErrorProps): ReactElement {
  const { t } = useTranslation();
  const { id, message, nativeError, removeError } = props;
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
              <div className="flex">{JSON.stringify(nativeError)}</div>
            ) : null}
          </div>
        ) : null}
      </div>
      <button
        onClick={() => removeError(id)}
        className="absolute right-3 top-[-0.5rem] z-50"
        type="button"
      >
        <img src={closeIcon} alt="close" width={20} height={20} />
      </button>
    </div>
  );
}

type ErrorsListProps = {
  errors: ILauncherError[];
  setErrors: (error: ILauncherError[]) => void;
};
function ErrorsList(props: ErrorsListProps): ReactElement {
  const { errors, setErrors } = props;

  const removeError = (id: number) => {
    const newErrors = errors.filter((error) => error.id !== id);
    setErrors(newErrors);
  };

  return (
    <div className="absolute bottom-2 right-2 max-h-[85vh] overflow-y-auto pt-4">
      <div className="flex w-[380px] flex-col gap-4 transition-all">
        {errors.length > 0
          ? errors.map(({ id, message, nativeError }) => (
              <Error
                key={`${id}-error`}
                id={id}
                message={message}
                nativeError={nativeError}
                removeError={removeError}
              />
            ))
          : null}
      </div>
    </div>
  );
}

export default ErrorsList;
