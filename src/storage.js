/**
 * 数据存储管理模块
 */
class StorageManager {
  constructor() {
    // 防御性检查
    if (typeof CONFIG === 'undefined') {
      console.error('[StorageManager] CONFIG 未定义！');
      return;
    }
    
    this.storageKey = CONFIG.STORAGE.KEY_SERVER_DATA;
    this.expirationKey = CONFIG.STORAGE.KEY_EXPIRATION;
    this.log('存储管理器初始化完成');
  }

  /**
   * 保存数据到localStorage
   */
  save(data) {
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(this.storageKey, jsonData);
      
      const expiration = Date.now() + CONFIG.STORAGE.CACHE_DURATION;
      localStorage.setItem(this.expirationKey, expiration.toString());
      
      this.log('数据已保存到本地存储');
      return true;
    } catch (error) {
      this.error('保存数据失败:', error);
      return false;
    }
  }

  /**
   * 从localStorage读取数据
   */
  load() {
    try {
      const data = localStorage.getItem(this.storageKey);
      
      if (!data || data === 'null' || data === 'undefined' || data.trim() === '') {
        return null;
      }

      // 检查是否过期
      const expiration = localStorage.getItem(this.expirationKey);
      if (expiration && Date.now() > parseInt(expiration)) {
        this.log('缓存已过期');
        this.clear();
        return null;
      }

      return JSON.parse(data);
    } catch (error) {
      this.error('读取数据失败:', error);
      return null;
    }
  }

  /**
   * 清除存储
   */
  clear() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.expirationKey);
    this.log('存储已清除');
  }

  /**
   * 检查数据是否存在
   */
  hasData() {
    return this.load() !== null;
  }

  // 日志方法
  log(...args) {
    if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG) {
      console.log('[StorageManager]', ...args);
    }
  }

  error(...args) {
    console.error('[StorageManager]', ...args);
  }
}

// 安全初始化
(function initStorageManager() {
  if (typeof CONFIG !== 'undefined') {
    window.storageManager = new StorageManager();
  } else {
    console.warn('[StorageManager] 等待 CONFIG 加载...');
    setTimeout(initStorageManager, 50);
  }
})();
