import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { LauncherLogs } from 'types';
import {
  IRequestServersResponse,
  getAvailableServers,
} from '../../services/api';
import { IServer } from '../../types';
import { addNotification } from '../notifications/notifications.slice';

/**
 * Request available for user servers.
 */
export const requestServers = createAsyncThunk(
  'main/requestServers',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const servers = await getAvailableServers();

      return servers;
    } catch (error) {
      dispatch(
        addNotification({
          type: LauncherLogs.error,
          key: 'FAILED_TO_GET_SERVERS_LIST',
          nativeError: error,
        })
      );
      return rejectWithValue((error as AxiosError).response?.data || error);
    }
  }
);

export interface MainState {
  isLoading: boolean;
  availableServers: IServer[];
  selectedServer: IServer | null;
}

const initialState: MainState = {
  isLoading: false,
  availableServers: [],
  selectedServer: null,
};

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    selectServer: (state, action: PayloadAction<IServer>) => {
      state.selectedServer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        requestServers.fulfilled,
        (state, action: PayloadAction<IRequestServersResponse[]>) => {
          state.availableServers = action.payload;
          state.selectedServer = action.payload[0] || null;
          state.isLoading = false;
        }
      )
      .addCase(requestServers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestServers.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { selectServer } = mainSlice.actions;
export default mainSlice.reducer;
