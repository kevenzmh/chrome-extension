/**
 * 本地 Mock 数据加载器
 */
class MockDataLoader {
  constructor() {
    this.mockData = null;
    this.loading = false;
    this.loaded = false;
  }

  /**
   * 加载本地 JSON 数据
   */
  async load() {
    if (this.loaded) {
      return this.mockData;
    }

    if (this.loading) {
      // 等待正在进行的加载
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.loaded) {
            clearInterval(checkInterval);
            resolve(this.mockData);
          }
        }, 50);
      });
    }

    this.loading = true;

    try {
      this.log('开始加载本地 Mock 数据...');

      const dataUrl = chrome.runtime.getURL(CONFIG.MOCK.DATA_FILE);
      const response = await fetch(dataUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.mockData = await response.json();
      this.loaded = true;
      this.loading = false;

      this.log('✅ Mock 数据加载成功', {
        campaigns: this.mockData.campaignCost?.length || 0,
        ads: this.mockData.adCost?.length || 0,
        audiences: this.mockData.audiencesCost?.length || 0
      });

      // 保存到缓存
      if (window.storageManager) {
        window.storageManager.save(this.mockData);
      }

      return this.mockData;

    } catch (error) {
      this.error('❌ Mock 数据加载失败:', error);
      this.loading = false;
      return null;
    }
  }

  /**
   * 获取数据（同步方式，优先使用缓存）
   */
  getDataSync() {
    // 1. 优先返回已加载的数据
    if (this.mockData) {
      return this.mockData;
    }

    // 2. 尝试从缓存读取
    if (window.storageManager) {
      const cached = window.storageManager.load();
      if (cached) {
        this.mockData = cached;
        this.loaded = true;
        this.log('从缓存读取 Mock 数据');
        return cached;
      }
    }

    // 3. 数据未加载，触发异步加载
    this.load();
    return null;
  }

  /**
   * 刷新数据
   */
  async refresh() {
    this.loaded = false;
    this.mockData = null;
    return await this.load();
  }

  /**
   * 获取指定类型的数据
   */
  getData(type) {
    const data = this.getDataSync();
    if (!data) return null;

    switch (type) {
      case 'account':
        return data.accountCost;
      case 'campaign':
        return data.campaignCost;
      case 'ad':
        return data.adCost;
      case 'adgroup':
        return data.adGroupCost;
      case 'audience':
        return data.audiencesCost;
      case 'keyword':
        return data.keywordCost;
      case 'asset':
        return data.assetCost;
      case 'bill':
        return data.bill;
      case 'device':
        return data.deviceData;
      case 'chart':
        return data.accountCostChart;
      default:
        return data;
    }
  }

  // 日志方法
  log(...args) {
    if (CONFIG.DEBUG) {
      console.log('%c[MockDataLoader]', 'color: #FF9800; font-weight: bold', ...args);
    }
  }

  error(...args) {
    console.error('%c[MockDataLoader]', 'color: #F44336; font-weight: bold', ...args);
  }
}

// 导出全局实例
window.mockDataLoader = new MockDataLoader();

// 立即开始预加载
if (CONFIG.API.MODE === 'mock' && CONFIG.MOCK.ENABLED) {
  window.mockDataLoader.load();
}
