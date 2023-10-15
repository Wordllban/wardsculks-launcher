import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { LauncherLogs } from 'types';
import {
  IRequestJavaServerInfoResponse,
  getJavaSeverInfo,
} from '../../services/api';
import { IServerInfo } from '../../types';
import { addNotification } from '../notifications/notifications.slice';

// if we will have multiple servers in future, update this function to pass server for request
export const requestJavaServerInfo = createAsyncThunk(
  'server/requestJavaServerInfo',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const info = await getJavaSeverInfo();

      return info;
    } catch (error) {
      dispatch(
        addNotification({
          type: LauncherLogs.error,
          key: 'FAILED_TO_GET_SERVER_INFO',
          nativeError: error,
        })
      );
      return rejectWithValue((error as AxiosError).response?.data || error);
    }
  }
);

export interface ServerState {
  isLoading: boolean;
  serverInfo: IServerInfo;
}

const initialState: ServerState = {
  isLoading: false,
  serverInfo: {
    online: false,
    host: '',
    players: {
      online: 0,
      max: 0,
      list: [],
    },
  },
};

/**
 * Redux slice to store Java server information
 */
const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        requestJavaServerInfo.fulfilled,
        (state, action: PayloadAction<IRequestJavaServerInfoResponse>) => {
          if (action.payload.online) state.serverInfo = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(requestJavaServerInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestJavaServerInfo.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default serverSlice.reducer;
