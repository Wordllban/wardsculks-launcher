import {
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, InputRange, Layout, ArrowBack } from '../../common';
import { getSystemMemory, saveMultipleSettingsOptions } from './utils';
import { ISettings, SettingsList, LauncherLogs } from '../../../../types';
import { MIN_MEMORY } from '../../../../constants/settings';
import { formatBytes } from '../../../../utils';
import { AppState, addNotification } from '../../../redux';

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { name } = useSelector((state: AppState) => state.main.selectedServer);

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
        dispatch(
          addNotification({
            message: t('FAILED_TO_GET_SETTINGS'),
            nativeError: error,
            type: LauncherLogs.error,
          })
        )
      );
  }, []);

  useEffect(() => {
    getCurrentSettings();
  }, []);

  useEffect(() => {
    getSystemMemory()
      .then((memory) => {
        const memoryInGB = formatBytes(memory, 0).value;
        return setMaxMemory(memoryInGB);
      })
      .catch((error) =>
        dispatch(
          addNotification({
            message: t('FAILED_TO_GET_SYSTEM_MEMORY'),
            nativeError: error,
            type: LauncherLogs.error,
          })
        )
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
        initialValue: newSettings[SettingsList.isDebug]?.value,
        onCheckbox: () => {
          setNewSettings((prevState) => ({
            ...prevState,
            [SettingsList.isDebug]: {
              value: !prevState[SettingsList.isDebug].value,
              type: prevState[SettingsList.isDebug].type,
            },
          }));
        },
      },
      {
        name: 'auto-join',
        title: t('AUTO_JOIN_SERVER'),
        description: t('AUTO_JOIN_SERVER_DESCRIPTION'),
        initialValue: newSettings[SettingsList.isAutoJoin]?.value,
        onCheckbox: () => {
          setNewSettings((prevState) => ({
            ...prevState,
            [SettingsList.isAutoJoin]: {
              value: !prevState[SettingsList.isAutoJoin].value,
              type: prevState[SettingsList.isAutoJoin].type,
            },
          }));
        },
      },
      {
        name: 'fullscreen',
        title: t('FULLSCREEN_MODE'),
        description: t('FULLSCREEN_MODE_DESCRIPTION'),
        initialValue: newSettings[SettingsList.isFullScreen]?.value,
        onCheckbox: () => {
          setNewSettings((prevState) => ({
            ...prevState,
            [SettingsList.isFullScreen]: {
              value: !newSettings[SettingsList.isFullScreen].value,
              type: newSettings[SettingsList.isFullScreen].type,
            },
          }));
        },
      },
    ],
    [t, newSettings]
  );

  const handleSaveSettings = () => {
    saveMultipleSettingsOptions(newSettings, name);
    navigate('/main-menu');
  };

  const hasSettingsChanged: boolean = useMemo(
    () =>
      Object.keys(currentSettings.current).some((key) => {
        return (
          currentSettings.current[key as SettingsList].value !==
          newSettings[key as SettingsList].value
        );
      }),
    [newSettings]
  );

  // add type launch setting & in-game setting

  return (
    <Layout mainBackground="bg-settings-bg">
      <ArrowBack
        position="absolute left-0 top-0"
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
                [SettingsList.maxMemoryUsage]: {
                  value: Number(e.target.value),
                  type: newSettings[SettingsList.maxMemoryUsage].type,
                },
              }));
            }}
            className="mb-6"
            initialValue={Number(
              newSettings[SettingsList.maxMemoryUsage]?.value
            )}
          />
          {settingsWithCheckboxes.map((setting) => (
            <Setting {...setting} key={`${setting.name}-setting`} />
          ))}
          {/* feature: ability to change game folder */}
          {/* <div className="flex items-center">
            <span className="mr-5 text-xs text-main">
              C:\Users\harmf\AppData\Roaming\WardSculks\updates
            </span>
            <Button className="hover:glow-text px-1 text-sm">
              {t('CHANGE_PATH')}
            </Button>
          </div> */}
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
