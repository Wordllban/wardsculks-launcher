import { ReactElement, useMemo, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import {
  ArrowBack,
  Button,
  IMenuGroupItem,
  Layout,
  MenuGroup,
  SearchInput,
  Frame,
} from '../../common';
import {
  IUIMod,
  ModsFilters,
  ModsFiltersTypes,
  ModsTypes,
} from '../../../types';
import {
  AppDispatch,
  AppState,
  getModsByCategory,
  requestAllMods,
  requestSelectedModsSave,
  selectFilters,
} from '../../../redux';
import Mod from './Mod';

type IUIModCategory = IMenuGroupItem & { key: ModsFiltersTypes };

export function Mods(): ReactElement {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const mods = useSelector((state: AppState) => getModsByCategory(state));

  const { id: serverId } = useSelector(
    (state: AppState) => state.main.selectedServer
  );

  const categories: IUIModCategory[] = useMemo(
    () => [
      { text: t('ALL'), key: ModsFilters.ALL },
      { text: t('SELECTED'), key: ModsFilters.SELECTED },
      { text: t('UNSELECTED'), key: ModsFilters.UNSELECTED },
      { text: t('SHADERS'), key: ModsTypes.SHADER },
      { text: t('TEXTURE_PACKS'), key: ModsTypes.RESOURCE },
    ],
    []
  );

  const searchMods = (event: ChangeEvent<HTMLInputElement>) => {
    const selectSearchTerm = () =>
      dispatch(selectFilters({ searchTerm: event.target.value }));

    debounce(selectSearchTerm, 500)();
  };

  const handleCategorySelect = (category: IUIModCategory) =>
    dispatch(selectFilters({ category: category.key }));

  const handleSaveSelectedMods = () => dispatch(requestSelectedModsSave());

  const handleDiscordInvitation = () =>
    window.electron.ipcRenderer.sendMessage(
      'open-external-link',
      window.env.DISCORD_LINK
    );

  useEffect(() => {
    dispatch(requestAllMods(serverId));
  }, []);

  return (
    <Layout mainBackground="bg-mods-bg">
      <ArrowBack position="absolute left-0 top-0" />
      <div className="mt-4 flex h-full items-start justify-end gap-2">
        <div className="items-between flex h-full w-40 flex-col gap-3">
          <div className="flex flex-col gap-3">
            <SearchInput
              width="w-40"
              inputProps={{
                placeholder: t('SEARCH_PLACEHOLDER'),
                onChange: searchMods,
              }}
            />
            <MenuGroup
              items={categories}
              onSelect={handleCategorySelect}
              defaultValue={categories[0]}
              align="items-end"
            />
          </div>
          <Button
            className="mt-2 py-1"
            onClick={handleSaveSelectedMods}
            aria-label="Save"
          >
            {t('SAVE_CHANGES')}
          </Button>
        </div>

        <div className="scrollbar-gutter h-[85vh] w-[55%] overflow-y-auto">
          {mods.length ? (
            mods.map(
              ({ id, title, description, imageUrl, selected }: IUIMod) => (
                <Mod
                  key={`mod-${id}`}
                  id={id}
                  name={title}
                  description={description}
                  icon={imageUrl}
                  isChecked={selected}
                />
              )
            )
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-22">
              <Frame
                className="flex w-4/5 flex-col items-center justify-center px-4 py-12"
                border="border-4 border-solid border-cyan-650"
                hasShadow={false}
              >
                <h3 className="p-1">{t('MODS_SEARCH_NO_RESULTS')}</h3>
                <p className="my-4 p-1 text-base">
                  {t('MODS_SEARCH_NO_RESULTS_SUGGESTION')}
                </p>
                <Button
                  className="hover:glow-text px-[46px] py-3 text-22"
                  onClick={handleDiscordInvitation}
                  aria-label="Join Discord"
                >
                  {t('JOIN')}
                </Button>
              </Frame>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
