/* eslint no-console: off */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["registration", "getUser", "updateAccessToken"] }] */

import {
  ICreateUserResponse,
  IRetrieveTokensResponse,
  createUser,
  getUserFromToken,
  refreshAccessToken,
  retrieveTokens,
} from './api';
import client from './client.service';

class AuthService {
  private access: string | null = null;

  private refresh: string | null = null;

  /**
   * Create new user
   *
   * @param username - User account name
   * @param password - User account password
   * @param email - User account email
   *
   * @returns `access`, `refresh`, `username`
   */
  async registration(
    username: string,
    password: string,
    email: string
  ): Promise<ICreateUserResponse> {
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
      return { user: null, access: null, refresh: null };
    }
  }

  /**
   * Request tokens from server
   *
   * @param username - User account name
   * @param password - User account password
   *
   * @returns {Object} `{ access, refresh }` - Object with tokens
   */
  async requestTokens(
    username: string,
    password: string
  ): Promise<IRetrieveTokensResponse> {
    try {
      const { data } = await retrieveTokens({ username, password });
      const { access, refresh } = data;

      this.access = access;
      this.refresh = refresh;

      return { access: this.access, refresh: this.refresh };
    } catch (error) {
      return { access: null, refresh: null };
    }
  }

  /**
   * Refresh current tokens.
   *
   * @param username - User account name
   * @param password - User account password
   *
   * @returns `access` & `refresh` tokens
   */
  async requestTokensRefresh(
    username: string,
    password: string
  ): Promise<IRetrieveTokensResponse> {
    const refreshToken: string | null = await this.getRefreshToken();

    if (!refreshToken) {
      console.error('Please, log in again.');
    }

    try {
      const tokens = await this.requestTokens(username, password);

      this.access = tokens.access;
      this.refresh = tokens.refresh;

      return tokens;
    } catch (error) {
      // TODO: add error handler
      console.error('Failed to refresh tokens');
      return { access: null, refresh: null };
    }
  }

  /**
   * Get current refresh token.
   *
   * @returns refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    if (!this.refresh) {
      this.refresh = await window.electron.ipcRenderer.invoke(
        'get-refresh-token'
      );
    }

    return this.refresh;
  }

  /**
   * Get current access token.
   *
   * @returns access token
   */
  async getAccessToken() {
    if (!this.access) {
      this.access = await window.electron.ipcRenderer.invoke(
        'get-access-token'
      );
    }

    return this.access;
  }

  /**
   * Logout from current account.
   * Delete tokens from system's keychain.
   *
   * @returns `Promise<void>`
   */
  async logout(): Promise<void> {
    window.electron.ipcRenderer.sendMessage('logout');
    this.access = null;
    this.refresh = null;
  }

  async getUser(accessToken: string) {
    try {
      const { data } = await getUserFromToken(accessToken);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async updateAccessToken(refreshToken: string) {
    try {
      const { data } = await refreshAccessToken(refreshToken);
      await client.updateInterceptor(data.access);
      return data;
    } catch (error) {
      console.error(error);
      return { access: null };
    }
  }
}

const auth = new AuthService();

export default auth;
