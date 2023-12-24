import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
  ICreateUserResponse,
  IRetrieveTokensResponse,
  IUser,
  createUser,
  getUserFromToken,
  refreshAccessToken,
  requestCode,
  requestPasswordReset,
  retrieveTokens,
} from '../../services/api';
import client from '../../services/client.service';
import { addNotification } from '../notifications/notifications.slice';
import { LauncherLogs } from '../../../types';
import { sleep } from '../../../utils';

/**
 * Create new user
 *
 * @param username - User account name
 * @param password - User account password
 * @param email - User account email
 *
 * @returns `access`, `refresh`, `username`
 */
export const register = createAsyncThunk(
  'auth/register',
  async (
    {
      username,
      password,
      email,
    }: {
      username: string;
      password: string;
      email: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const machineId = await window.electron.ipcRenderer.invoke(
        'get-machine-id'
      );

      const { data } = await createUser({
        username,
        password,
        email,
        machine_id: machineId,
      });

      const { user, access, refresh } = data;

      if (user && access && refresh) {
        window.electron.ipcRenderer.sendMessage('save-access-token', [access]);
        window.electron.ipcRenderer.sendMessage('save-refresh-token', [
          refresh,
        ]);
      }

      return data;
    } catch (error) {
      dispatch(
        addNotification({
          key: 'FAILED_TO_REGISTER',
          type: LauncherLogs.error,
          nativeError: (error as AxiosError).response?.data || error,
        })
      );
      return rejectWithValue(null);
    }
  }
);

/**
 * Request tokens from server
 *
 * @param username - User account name
 * @param password - User account password
 *
 * @returns {Object} `{ access, refresh }` - Object with tokens
 */
export const requestTokens = createAsyncThunk(
  'auth/requestTokens',
  async (
    {
      username,
      password,
    }: {
      username: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await retrieveTokens({ username, password });
      return data;
    } catch (error) {
      return rejectWithValue((error as AxiosError).response?.data || error);
    }
  }
);

export const requestUser = createAsyncThunk(
  'auth/requestUser',
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const { data } = await getUserFromToken(accessToken);
      return data;
    } catch (error) {
      return rejectWithValue((error as AxiosError).response?.data || error);
    }
  }
);

export const updateAccessToken = createAsyncThunk(
  'auth/updateAccessToken',
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const { data } = await refreshAccessToken(refreshToken);
      await client.updateInterceptor(data.access);
      return data;
    } catch (error) {
      return rejectWithValue((error as AxiosError).response?.data || error);
    }
  }
);

export const requestResetCode = createAsyncThunk(
  'auth/requestResetCode',
  async (email: string, { dispatch, rejectWithValue }) => {
    try {
      await requestCode(email);
      dispatch(
        addNotification({
          key: 'CONFIRMATION_CODE_REQUESTED_SUCCESSFULLY',
          type: LauncherLogs.log,
        })
      );
      return true;
    } catch (error) {
      dispatch(
        addNotification({
          key: 'FAILED_TO_REQUEST_RESET_CODE',
          type: LauncherLogs.error,
          nativeError: (error as AxiosError).response?.data || error,
        })
      );
      return rejectWithValue(null);
    }
  }
);

export const requestChangePassword = createAsyncThunk(
  'auth/requestChangePassword',
  async (
    {
      email,
      code,
      newPassword,
    }: {
      email: string;
      code: string;
      newPassword: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await requestPasswordReset(email, code, newPassword);

      dispatch(
        addNotification({
          key: 'PASSWORD_CHANGED_SUCCESSFULLY',
          type: LauncherLogs.log,
        })
      );

      await sleep(100);

      dispatch(
        addNotification({
          key: 'REDIRECT_AFTER_PASSWORD_CHANGE',
          type: LauncherLogs.log,
          lifetime: 4000,
        })
      );
      return true;
    } catch (error) {
      dispatch(
        addNotification({
          key: 'FAILED_TO_REQUEST_PASSWORD_CHANGE',
          type: LauncherLogs.error,
          nativeError: (error as AxiosError).response?.data || error,
        })
      );
      return rejectWithValue(false);
    }
  }
);

export interface AuthState {
  isLoading: boolean;
  access: string;
  refresh: string;
  user: IUser;
}

const initialState: AuthState = {
  isLoading: false,
  access: '',
  refresh: '',
  user: {
    username: '',
    email: '',
    id: -1,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Logout from current account.
     * Delete tokens from system's keychain.
     */
    logout: (state) => {
      window.electron.ipcRenderer.sendMessage('logout');
      state.access = '';
      state.refresh = '';
      state.user = {
        username: '',
        email: '',
        id: -1,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<ICreateUserResponse>) => {
          const { user, access, refresh } = action.payload;
          state.access = access || '';
          state.refresh = refresh || '';
          state.user = user;
          state.isLoading = false;
        }
      )
      .addCase(
        requestTokens.fulfilled,
        (state, action: PayloadAction<IRetrieveTokensResponse>) => {
          const { access, refresh } = action.payload;
          state.access = access || '';
          state.refresh = refresh || '';
          state.isLoading = false;
        }
      )
      .addCase(requestUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateAccessToken.fulfilled, (state, action) => {
        state.access = action.payload.access;
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(
          register.pending,
          requestTokens.pending,
          requestUser.pending,
          updateAccessToken.pending,
          requestResetCode.pending,
          requestChangePassword.pending
        ),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        isAnyOf(
          register.rejected,
          requestTokens.rejected,
          requestUser.rejected,
          updateAccessToken.rejected,
          requestResetCode.rejected,
          requestResetCode.fulfilled,
          requestChangePassword.rejected,
          requestChangePassword.fulfilled
        ),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
