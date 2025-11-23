/**
 * 数据处理器 - 处理复杂的数据计算逻辑
 */
class DataProcessor {
  constructor() {
    this.log('数据处理器初始化');
  }

  /**
   * 计算广告统计数据
   * @param {Array} orderConfig - 字段配置
   * @param {Array} originalValues - 原始值
   * @param {Object} sourceData - 数据源
   */
  calculateAdStats(orderConfig, originalValues, sourceData) {
    if (!orderConfig || orderConfig.length === 0) {
      return originalValues;
    }

    const result = [];
    const indices = orderConfig.map(config => config['3']);

    indices.forEach((fieldPath, index) => {
      const value = this.getNestedValue(sourceData, fieldPath);
      
      if (value !== undefined) {
        result.push(typeof value === 'string' ? value : value.toString());
      } else {
        result.push(originalValues[index] || '--');
      }
    });

    return result;
  }

  /**
   * 获取嵌套对象的值
   * @param {Object} obj - 对象
   * @param {String} path - 路径 (如 'stats.clicks')
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current?.[key];
    }, obj);
  }

  /**
   * 设置嵌套对象的值
   */
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);

    target[lastKey] = value;
  }

  /**
   * 处理折线图数据
   */
  processChartData(chartData, statsData) {
    if (!chartData || !statsData) return chartData;

    return {
      clicks: chartData.map(() => statsData['stats.clicks']),
      impressions: chartData.map(() => statsData['stats.impressions']),
      cost: chartData.map(() => statsData['stats.cost']),
      cpc: chartData.map(() => statsData['stats.cost_per_click'])
    };
  }

  /**
   * 按设备类型分配数据
   */
  splitByDevice(sourceData) {
    return {
      desktop: this.scaleData(sourceData, CONFIG.DATA_RATIOS.COMPUTED),
      tablet: this.scaleData(sourceData, CONFIG.DATA_RATIOS.IPAD),
      mobile: this.scaleData(sourceData, CONFIG.DATA_RATIOS.IPHONE)
    };
  }

  /**
   * 按比例缩放数据
   */
  scaleData(data, ratio) {
    const result = {};
    
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'number') {
        result[key] = data[key] * ratio;
      } else {
        result[key] = data[key];
      }
    });

    return result;
  }

  /**
   * 处理受众数据
   */
  processAudienceData(audienceList, ageGroups, genders, incomes) {
    return {
      age: this.groupAudienceData(audienceList, ageGroups),
      gender: this.groupAudienceData(audienceList, genders),
      income: this.groupAudienceData(audienceList, incomes)
    };
  }

  /**
   * 分组受众数据
   */
  groupAudienceData(audienceList, groups) {
    const result = {};
    
    groups.forEach(group => {
      const filtered = audienceList.filter(item => item.type === group.type);
      result[group.name] = this.sumAudienceStats(filtered);
    });

    return result;
  }

  /**
   * 汇总受众统计
   */
  sumAudienceStats(items) {
    return items.reduce((sum, item) => {
      return {
        clicks: (sum.clicks || 0) + (item.clicks || 0),
        impressions: (sum.impressions || 0) + (item.impressions || 0),
        cost: (sum.cost || 0) + (item.cost || 0),
        conversions: (sum.conversions || 0) + (item.conversions || 0)
      };
    }, {});
  }

  /**
   * 格式化货币
   */
  formatCurrency(amount, currency = 'USD') {
    const symbols = {
      USD: '$',
      CNY: '¥',
      EUR: '€',
      GBP: '£'
    };

    return `${symbols[currency] || ''}${amount.toLocaleString()}`;
  }

  /**
   * 格式化百分比
   */
  formatPercentage(value, decimals = 2) {
    return `${(value * 100).toFixed(decimals)}%`;
  }

  /**
   * 格式化日期
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  /**
   * 深拷贝对象
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * 安全解析JSON
   */
  safeJsonParse(str, defaultValue = null) {
    try {
      return JSON.parse(str);
    } catch (error) {
      this.error('JSON解析失败:', error);
      return defaultValue;
    }
  }

  /**
   * 安全序列化JSON
   */
  safeJsonStringify(obj, defaultValue = '{}') {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      this.error('JSON序列化失败:', error);
      return defaultValue;
    }
  }

  // 日志方法
  log(...args) {
    if (CONFIG.DEBUG) {
      console.log('[DataProcessor]', ...args);
    }
  }

  error(...args) {
    console.error('[DataProcessor]', ...args);
  }
}

// 导出实例
window.dataProcessor = new DataProcessor();