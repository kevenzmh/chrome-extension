/**
 * 主业务逻辑
 */
class MainLogic {
  constructor() {
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    this.log('插件主逻辑启动');

    // 等待页面加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.onReady();
      });
    } else {
      this.onReady();
    }
  }

  /**
   * 页面准备完成
   */
  onReady() {
    this.log('页面加载完成');

    // 从缓存加载数据
    this.loadCachedData();

    // 初始化全局对象
    this.setupGlobalAPI();
  }

  /**
   * 从缓存加载数据
   */
  loadCachedData() {
    const cachedData = window.storageManager.load();
    
    if (cachedData) {
      this.log('从缓存加载数据');
      window.requestInterceptor.processServerData(cachedData);
    } else {
      this.log('无缓存数据');
    }
  }

  /**
   * 设置全局API
   */
  setupGlobalAPI() {
    // 暴露获取最新数据的方法
    window.getLatestServerData = () => {
      return window.requestInterceptor.latestServerData || window.storageManager.load();
    };

    // 暴露清除缓存的方法
    window.clearCache = () => {
      window.storageManager.clear();
      this.log('缓存已清除');
    };

    this.log('全局API已设置');
  }

  // 日志方法
  log(...args) {
    if (CONFIG.DEBUG) {
      console.log('[MainLogic]', ...args);
    }
  }
}

// 启动主逻辑
window.mainLogic = new MainLogic();