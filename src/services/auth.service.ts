/* eslint no-console: off */
import client from './client.service';

interface IRetrieveTokensResponse {
  access: string | null;
  refresh: string | null;
}

const retrieveTokens = (data: any) => {
  return client.post<IRetrieveTokensResponse>('/users/auth/token/obtain', {
    ...data,
  });
};

class AuthService {
  private access: string | null = null;

  private refresh: string | null = null;

  /**
   * Request tokens from server
   *
   * @param username - User account name
   * @param passowrd - User account password
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
      // TODO: add error handler
      console.error('Failted to request tokens');
      return { access: null, refresh: null };
    }
  }

  /**
   * Refresh current tokens.
   *
   * @param username - User account name
   * @param passowrd - User account password
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
      this.refresh = await window.tokens.getRefreshToken();
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
      this.access = await window.tokens.getAccessToken();
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
}

const auth = new AuthService();

export default auth;
