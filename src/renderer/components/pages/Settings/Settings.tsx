import { ReactElement, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, InputRange, Layout, ArrowBack } from '../../common';
import { formatBytes, getSystemMemory } from './utils';

const MIN_MEMORY = 1;
/**
 * TODO: store settings locally
 * TODO: get app folder real location
 */

type SettingProps = {
  title: string;
  onCheckbox: () => void;
  description?: string;
};

function Setting(props: SettingProps) {
  const { title, description, onCheckbox } = props;
  return (
    <div className="mb-5 flex flex-col items-start">
      <label className="flex items-start leading-4">
        <Checkbox className="mr-2" onClick={() => onCheckbox()} />
        <span className="hover:glow-text flex flex-row items-center text-main">
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
  const { t } = useTranslation();

  const [maxMemory, setMaxMemory] = useState<number>(0);

  useEffect(() => {
    getSystemMemory()
      .then((memory) => {
        const memoryInGB = formatBytes(memory);
        return setMaxMemory(memoryInGB);
      })
      .catch((error) => console.error(error));
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

  const settingsWithCheckboxes: SettingProps[] = useMemo(
    () => [
      {
        key: 'setting-debug',
        title: t('DEBUG_MODE'),
        description: t('DEBUG_MODE_DESCRIPTION'),
        onCheckbox: () => console.log(t('DEBUG_MODE')),
      },
      {
        key: 'setting-auto-join',
        title: t('AUTO_JOIN_SERVER'),
        description: t('AUTO_JOIN_SERVER_DESCRIPTION'),
        onCheckbox: () => console.log(t('AUTO_JOIN_SERVER')),
      },
      {
        key: 'setting-fullscreen',
        title: t('FULLSCREEN_MODE'),
        description: t('FULLSCREEN_MODE_DESCRIPTION'),
        onCheckbox: () => console.log(t('AUTO_JOIN_SERVER')),
      },
    ],
    [t]
  );

  return (
    <Layout mainBackground="bg-settings-bg" sideBackground="bg-settings-sides">
      <span className="absolute left-[1rem]">
        <ArrowBack />
      </span>
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex w-full flex-col items-end">
          <InputRange
            min={MIN_MEMORY}
            max={maxMemory}
            options={availableOptions}
            step={0.5}
            onChangeHandler={(e) => console.log(e.currentTarget.value)}
            className="mb-6"
          />
          {settingsWithCheckboxes.map((setting: SettingProps) => (
            <Setting {...setting} />
          ))}
          <div className="flex items-center">
            <span className="mr-5 text-xs text-main">
              C:\Users\harmf\AppData\Roaming\WardSculks\updates
            </span>
            <Button className="hover:glow-text px-1 text-sm">
              {t('CHANGE_PATH')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
