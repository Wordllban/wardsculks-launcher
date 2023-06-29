import ElectronStore from 'electron-store';
/**
 * Service for application settings. Use it only inside `Node`
 */
class StoreService {
  private store = new ElectronStore();

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
