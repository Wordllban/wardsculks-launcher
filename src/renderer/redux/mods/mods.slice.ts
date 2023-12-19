import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { LauncherLogs } from 'types';
import {
  getAllMods,
  getSelectedMods,
  saveSelectedMods,
} from '../../services/api';
import { IUIMod, ModsFilters, ModsFiltersTypes } from '../../types';
import { addNotification } from '../notifications/notifications.slice';
import type { AppState } from '../store';

export const requestAllMods = createAsyncThunk(
  'mods/requestAllMods',
  async (serverId: number, { dispatch, rejectWithValue }) => {
    try {
      const [{ data: mods }, { data: selectedIds }] = await Promise.all([
        getAllMods(serverId),
        getSelectedMods(serverId),
      ]);

      const parsedMods: IUIMod[] = mods.map((mod) => {
        return {
          ...mod,
          selected: selectedIds.includes(mod.id),
        };
      });

      return parsedMods;
    } catch (error) {
      dispatch(
        addNotification({
          type: LauncherLogs.error,
          key: 'FAILED_TO_GET_MODS_LIST',
          nativeError: (error as AxiosError)?.message || JSON.stringify(error),
        })
      );
      return rejectWithValue((error as AxiosError).response?.data || error);
    }
  }
);

export const requestSelectedModsSave = createAsyncThunk<
  unknown,
  void,
  { state: AppState }
>(
  'mods/requestSelectedModsSave',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const selectedModsIds = getState()
        .mods.mods.filter((mod: IUIMod) => mod.selected)
        .map((mod: IUIMod) => mod.id);

      await saveSelectedMods(selectedModsIds);

      dispatch(
        addNotification({
          type: LauncherLogs.log,
          key: 'MODS_SAVED_SUCCESSFULLY',
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: LauncherLogs.error,
          key: 'FAILED_TO_SAVE_SELECTED_MODS',
          nativeError: (error as AxiosError)?.message || JSON.stringify(error),
        })
      );
      return rejectWithValue((error as AxiosError).response?.data || error);
    }
  }
);

export interface ModsState {
  isLoading: boolean;
  mods: IUIMod[];
  filters: {
    category: ModsFiltersTypes;
    searchTerm: string | null;
  };
}

const initialState: ModsState = {
  isLoading: false,
  mods: [],
  filters: {
    category: ModsFilters.ALL,
    searchTerm: null,
  },
};

/**
 * Redux slice to store optional mods
 */
const modsSlice = createSlice({
  name: 'mods',
  initialState,
  reducers: {
    selectMod: (state, action: PayloadAction<number>) => {
      state.mods = state.mods.map((mod) =>
        mod.id === action.payload ? { ...mod, selected: !mod.selected } : mod
      );
    },
    selectFilters: (
      state,
      action: PayloadAction<{
        category?: ModsFiltersTypes;
        searchTerm?: string | null;
      }>
    ) => {
      const { category, searchTerm } = action.payload;

      if (category) {
        state.filters.category = category;
      }

      if (searchTerm !== undefined) {
        state.filters.searchTerm = searchTerm;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        requestAllMods.fulfilled,
        (state, action: PayloadAction<IUIMod[]>) => {
          state.mods = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(requestAllMods.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestAllMods.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export const { selectMod, selectFilters } = modsSlice.actions;
export default modsSlice.reducer;
