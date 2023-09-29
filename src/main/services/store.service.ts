import ElectronStore from 'electron-store';
import { SETTINGS_TYPE } from '../../types';
/**
 * Service for application settings. Use it only inside `Node`
 */
class StoreService {
  private store = new ElectronStore({
    defaults: {
      memoryUsage: {
        value: 2,
        type: SETTINGS_TYPE.LAUNCH,
      },
      autoJoin: {
        value: false,
        type: SETTINGS_TYPE.LAUNCH,
      },
      isDebug: {
        value: false,
        type: SETTINGS_TYPE.LAUNCH,
      },
      fullscreen: {
        value: false,
        type: SETTINGS_TYPE.GAME,
      },
    },
  });

  set(key: string, value: unknown): void {
    this.store.set(key, value);
  }

  get(key: string) {
    const value = this.store.get(key);
    return value;
  }

  getAll() {
    const settings = this.store.store;
    return settings;
  }

  /**
   *
   * Check if an item exists.
   * @param key The key of the item to check.
   */
  has(key: string): boolean {
    return this.store.has(key);
  }
}

const store = new StoreService();

export default store;
