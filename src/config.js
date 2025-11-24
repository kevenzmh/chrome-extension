/**
 * 全局配置文件
 */
const CONFIG = {
  // API配置
  API: {
    BASE_URL: 'https://your-api-server.com/api',
    ENDPOINTS: {
      GET_DATA: '/google-ads/data'
    },
    TIMEOUT: 10000,
    // 数据模式: 'mock' = 本地JSON, 'api' = 真实API
    MODE: 'mock'
  },

  // 本地数据配置
  MOCK: {
    DATA_FILE: 'data/mock-data.json',
    ENABLED: true,
    AUTO_REFRESH: false, // 是否自动刷新模拟数据
    REFRESH_INTERVAL: 60000 // 刷新间隔（毫秒）
  },

  // 存储配置
  STORAGE: {
    KEY_SERVER_DATA: 'serverData',
    KEY_EXPIRATION: 'serverDataExpiration',
    CACHE_DURATION: 7 * 24 * 60 * 60 * 1000 // 7天
  },

  // 目标URL匹配
  TARGET_URLS: {
    OVERVIEW: 'OverviewService/Get',
    CAMPAIGN_LIST: 'CampaignService.List',
    AD_GROUP_LIST: 'AdGroupAdService.List',
    AGE_SERVICE: 'AgeService.List',
    GENDER_SERVICE: 'GenderService.List',
    DEVICE_SERVICE: 'DeviceService.List',
    BILLING_SUMMARY: 'BillingSummaryInfoService.Get',
    TRANSACTIONS: 'TransactionsSummaryService.GetSummaries'
  },

  // DOM选择器
  SELECTORS: {
    DATE_PICKER: '.date-picker-container',
    ACCOUNT_INFO: '.account-info',
    VIDEO_ADS_CARD: 'VIDEO-ADS-CARD',
    BILLING_CARD: 'BILLING-CARD',
    DEVICE_CARD: 'DEVICE-CARD'
  },

  // 隐藏元素列表
  HIDDEN_ELEMENTS: [
    'VIDEO-ADS-CARD',
    'BILLING-CARD',
    'DEVICE-CARD',
    'CONSUMER-INTEREST-SECTION',
    'TOP-SEARCH-KEYWORDS-CARD',
    'PERFORMANCE-STATUS-SECTION',
    'DIAGNOSTICS-SECTION',
    'DISCOVERY-ADS-CARD'
  ],

  // 数据计算比例
  DATA_RATIOS: {
    COMPUTED: 0.1,  // 计算数据比例
    IPAD: 0.2,      // iPad数据比例
    IPHONE: 0.7     // iPhone数据比例
  },

  // 调试模式
  DEBUG: true,

  // 控制台错误过滤
  CONSOLE_FILTER: {
    ENABLED: true,
    // 需要过滤的错误关键词
    FILTERED_ERRORS: [
      'AdTypePrefetcher',
      'StreamyHttpError',
      'ERROR_WITH_EMPTY_MESSAGE'
    ]
  }
};

// 导出配置
window.CONFIG = CONFIG;

// 打印配置信息
if (CONFIG.DEBUG) {
  console.log('%c[CONFIG] 配置加载成功', 'color: #4CAF50; font-weight: bold');
  console.log(`%c[CONFIG] 数据模式: ${CONFIG.API.MODE === 'mock' ? '本地JSON模拟' : '真实API'}`, 'color: #2196F3');
}
