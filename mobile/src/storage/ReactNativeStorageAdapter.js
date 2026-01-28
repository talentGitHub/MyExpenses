import AsyncStorage from '@react-native-async-storage/async-storage';

// StorageAdapter implementation for React Native
export class ReactNativeStorageAdapter {
  async save(key, data) {
    try {
      await AsyncStorage.setItem(key, data);
    } catch (error) {
      console.error('Storage save error:', error);
      throw error;
    }
  }

  async load(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Storage load error:', error);
      return null;
    }
  }

  async delete(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage delete error:', error);
      throw error;
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
      throw error;
    }
  }
}
