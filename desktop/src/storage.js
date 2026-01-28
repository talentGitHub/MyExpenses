const Store = require('electron-store');

// StorageAdapter implementation for Electron
class ElectronStorageAdapter {
  constructor() {
    this.store = new Store();
  }

  async save(key, data) {
    try {
      this.store.set(key, data);
    } catch (error) {
      console.error('Storage save error:', error);
      throw error;
    }
  }

  async load(key) {
    try {
      return this.store.get(key, null);
    } catch (error) {
      console.error('Storage load error:', error);
      return null;
    }
  }

  async delete(key) {
    try {
      this.store.delete(key);
    } catch (error) {
      console.error('Storage delete error:', error);
      throw error;
    }
  }

  async clear() {
    try {
      this.store.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
      throw error;
    }
  }
}

module.exports = { ElectronStorageAdapter };
