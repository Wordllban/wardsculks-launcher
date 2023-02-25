// @ts-nocheck
// @ts-ignore
import {
  findCredentials,
  setPassword,
  deletePassword,
  getPassword,
} from 'keytar';
import { userInfo } from 'os';

//
const tokens = async (login: string, passoword: string) => ({
  access: '',
  refresh: '',
});
//

const KEYTAR_SERVICE_NAME = 'keytar-pw';
const KEYTAR_ACCOUNT_NAME = userInfo().username;

class AuthService {
  private static instance: AuthService;

  private access: string | null = null;

  private refresh: string | null = null;

  /**
   * Request tokens from server
   *
   * @param login - User account login
   * @param passowrd - User account password
   *
   * @returns `Promise<void>`
   */
  async requestTokens(login: string, password: string): Promise<void> {
    try {
      const { access, refresh } = await tokens(login, password);

      this.access = access;
      this.refresh = refresh;

      if (this.refresh) {
        await setPassword(
          KEYTAR_SERVICE_NAME,
          KEYTAR_ACCOUNT_NAME,
          this.refresh
        );
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh current tokens.
   *
   * @returns `access` & `refresh` tokens
   */
  async requestTokensRefresh() {
    const refreshToken: string | null = await this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('Please, log in again.');
    }

    try {
      console.log('implementation');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current refresh token.
   * @returns `string`
   */
  async getRefreshToken(): Promise<string | null> {
    if (!this.refresh) {
      this.refresh = await getPassword(
        KEYTAR_SERVICE_NAME,
        KEYTAR_ACCOUNT_NAME
      );
    }

    return this.refresh;
  }

  /**
   * Get current access token.
   * @returns `string`
   */
  getAccessToken() {
    return this.access;
  }

  /**
   * Logout from current account.
   * Delete tokens from system's keychain.
   *
   * @returns `Promise<void>`
   */
  async logout(): Promise<void> {
    await deletePassword(KEYTAR_SERVICE_NAME, KEYTAR_ACCOUNT_NAME);
    this.access = null;
    this.refresh = null;
  }

  /**
   * Create service instance or return existing one
   * @returns Instance of auth service
   */
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new AuthService();
    return this.instance;
  }
}

export default AuthService;
