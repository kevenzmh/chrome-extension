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
    TIMEOUT: 10000
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
  DEBUG: true
};

// 导出配置
window.CONFIG = CONFIG;