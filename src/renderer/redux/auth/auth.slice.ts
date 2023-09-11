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
  retrieveTokens,
} from '../../services/api';
import client from '../../services/client.service';

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
    { rejectWithValue }
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

      return data;
    } catch (error) {
      return rejectWithValue((error as AxiosError).response?.data || error);
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
          requestTokens.pending,
          requestUser.pending,
          updateAccessToken.pending
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
          updateAccessToken.rejected
        ),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;