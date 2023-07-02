import {
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useContext,
} from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Button, Checkbox, InputRange, Layout, ArrowBack } from '../../common';
import { getSystemMemory, saveMultipleSettingsOptions } from './utils';
import { ISettings, SettingsList } from '../../../types';
import { MIN_MEMORY } from '../../../../constants/settings';
import { ErrorContext } from '../../../context/error/ErrorContext';
import { formatBytes } from '../../../../utils';

/**
 * TODO: get app folder real location
 */

type SettingProps = {
  title: string;
  onCheckbox: () => void;
  description?: string;
  initialValue?: boolean;
  disabled?: boolean;
};

function Setting(props: SettingProps) {
  const { title, description, initialValue, disabled, onCheckbox } = props;
  return (
    <div
      className={clsx('mb-5 flex flex-col items-start', {
        'cursor-not-allowed opacity-50': disabled,
      })}
    >
      <label className="flex items-start leading-4">
        <Checkbox
          className="mr-2"
          onChange={onCheckbox}
          checked={initialValue}
          disabled={disabled}
        />
        <span
          className={clsx(
            'hover:glow-text flex flex-row items-center text-main',
            {
              'cursor-not-allowed': disabled,
            }
          )}
        >
          {title}
        </span>
      </label>
      {description && (
        <span className="mt-2 w-[300px] pl-6 text-xs">{description}</span>
      )}
    </div>
  );
}

export function Settings(): ReactElement {
  const { showError } = useContext(ErrorContext);
  const { t } = useTranslation();

  const [maxMemory, setMaxMemory] = useState<number>(0);

  const currentSettings = useRef<any>({});
  const [newSettings, setNewSettings] = useState<ISettings>({} as ISettings);

  const getCurrentSettings = useCallback(() => {
    window.electron.ipcRenderer
      .invoke('get-all-settings')
      .then((result) => {
        currentSettings.current = result;
        setNewSettings(result);
        return result;
      })
      .catch((error) =>
        showError({ message: t('FAILED_TO_GET_SETTINGS'), nativeError: error })
      );
  }, []);

  useEffect(() => {
    getCurrentSettings();
  }, [getCurrentSettings]);

  useEffect(() => {
    getSystemMemory()
      .then((memory) => {
        const memoryInGB = formatBytes(memory, 0).value;
        return setMaxMemory(memoryInGB);
      })
      .catch((error) =>
        showError({
          message: t('FAILED_TO_GET_SYSTEM_MEMORY'),
          nativeError: error,
        })
      );
  }, []);

  const availableOptions: number[] = useMemo(() => {
    if (maxMemory === 0) return [];

    const middleValue = maxMemory / 2;
    const array = [
      MIN_MEMORY,
      // hack to get expected ticks for input range
      ...[-1, 0, 1].map((i) => middleValue + (i * middleValue) / 2),
      maxMemory,
    ];

    return array;
  }, [maxMemory]);

  const settingsWithCheckboxes: (SettingProps & { name: string })[] = useMemo(
    () => [
      {
        name: 'debug',
        title: t('DEBUG_MODE'),
        description: t('DEBUG_MODE_DESCRIPTION'),
        initialValue: false,
        disabled: true,
        onCheckbox: () => {
          console.log(t('DEBUG_MODE'));
        },
      },
      {
        name: 'auto-join',
        title: t('AUTO_JOIN_SERVER'),
        description: t('AUTO_JOIN_SERVER_DESCRIPTION'),
        initialValue: !!newSettings[SettingsList.serverAddress],
        onCheckbox: () => {
          setNewSettings((prevState) => ({
            ...prevState,
            [SettingsList.serverAddress]: prevState[SettingsList.serverAddress]
              ? null
              : `${window.env.SERVER_IP}:${window.env.SERVER_PORT}`,
          }));
        },
      },
      {
        name: 'fullscreen',
        title: t('FULLSCREEN_MODE'),
        description: t('FULLSCREEN_MODE_DESCRIPTION'),
        initialValue: newSettings[SettingsList.isFullScreen],
        onCheckbox: () => {
          setNewSettings((prevState) => ({
            ...prevState,
            [SettingsList.isFullScreen]:
              !newSettings[SettingsList.isFullScreen],
          }));
        },
      },
    ],
    [t, newSettings]
  );

  const handleSaveSettings = () => {
    saveMultipleSettingsOptions(newSettings);
    getCurrentSettings();
  };

  const hasSettingsChanged: boolean = useMemo(
    () =>
      Object.keys(currentSettings.current).some((key) => {
        return (
          currentSettings.current[key as SettingsList] !==
          newSettings[key as SettingsList]
        );
      }),
    [newSettings]
  );

  return (
    <Layout mainBackground="bg-settings-bg">
      <ArrowBack
        position="absolute left-[1rem]"
        hasConfirmation={hasSettingsChanged}
        confirmationWindowTitle={t('UNSAVED_SETTINGS_CONFIRMATION_TITLE')}
        confirmationWindowDescription={t(
          'UNSAVED_SETTINGS_CONFIRMATION_DESCRIPTION'
        )}
      />
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex w-full flex-col items-end">
          <InputRange
            min={MIN_MEMORY}
            max={maxMemory}
            options={availableOptions}
            step={0.5}
            onChangeHandler={(e) => {
              setNewSettings((prevState) => ({
                ...prevState,
                [SettingsList.maxMemoryUsage]: Number(e.target.value),
              }));
            }}
            className="mb-6"
            initialValue={Number(newSettings[SettingsList.maxMemoryUsage])}
          />
          {settingsWithCheckboxes.map((setting) => (
            <Setting {...setting} key={`${setting.name}-setting`} />
          ))}
          <div className="flex items-center">
            <span className="mr-5 text-xs text-main">
              C:\Users\harmf\AppData\Roaming\WardSculks\updates
            </span>
            <Button className="hover:glow-text px-1 text-sm">
              {t('CHANGE_PATH')}
            </Button>
          </div>
          <Button
            className="hover:glow-text my-[25px] px-[46px] py-3 text-22"
            onClick={handleSaveSettings}
          >
            {t('SAVE_CHANGES')}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
