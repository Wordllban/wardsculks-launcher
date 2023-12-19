import { createSelector } from 'reselect';
import { AppState } from '../store';
import { IUIMod, ModsFilters } from '../../types';

const getMods = (state: AppState) => state.mods.mods;

export const getModsByCategory = createSelector(
  [getMods, (state: AppState) => state.mods.filters],
  (mods: IUIMod[], { category, searchTerm }) => {
    const searchByCategory = (mod: IUIMod) => {
      switch (category) {
        case ModsFilters.ALL:
          return true;
        case ModsFilters.SELECTED:
          return mod.selected;
        case ModsFilters.UNSELECTED:
          return !mod.selected;
        default:
          return mod.type === category;
      }
    };

    const searchByTerm = (mod: IUIMod) => {
      if (!searchTerm) {
        return true;
      }
      return mod.title.match(new RegExp(searchTerm, 'i'));
    };

    return mods.filter(
      (mod: IUIMod) => searchByCategory(mod) && searchByTerm(mod)
    );
  }
);
