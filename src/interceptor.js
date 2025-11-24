/**
 * HTTP请求拦截器
 */
class RequestInterceptor {
  constructor() {
    this.latestServerData = null;
    this.lastRequestParams = {
      start: null,
      end: null
    };

    // 全局数据对象
    this.adsData = {};
    this.computedData = {};
    this.ipadData = {};
    this.iphoneData = {};

    this.init();
  }

  /**
   * 初始化拦截器
   */
  init() {
    // 检查ajaxhook是否加载
    if (!window.ah) {
      this.error('❌ ajaxhook 库未加载！请检查 lib/ajaxhook.min.js');
      return;
    }

    // 配置Ajax Hook
    window.ah.proxy({
      onRequest: (config, handler) => {
        this.handleRequest(config, handler);
      },
      onResponse: (response, handler) => {
        this.handleResponse(response, handler);
      }
    });

    // 预加载缓存数据
    this.preloadCachedData();

    this.log('✅ 请求拦截器已启动');
  }

  /**
   * 预加载缓存数据
   */
  preloadCachedData() {
    try {
      // 尝试从存储中加载数据
      if (window.storageManager) {
        const cachedData = window.storageManager.load();
        if (cachedData) {
          this.processServerData(cachedData);
          this.log('预加载缓存数据成功');
        }
      } else {
        // 如果存储管理器还没加载，稍后再试
        setTimeout(() => {
          this.preloadCachedData();
        }, 50);
      }
    } catch (error) {
      this.log('预加载缓存数据失败:', error);
    }
  }

  /**
   * 处理请求
   */
  handleRequest(config, handler) {
    try {
      // 提取时间范围参数
      const { start, end } = this.extractTimeParams(config);

      if (start && end) {
        this.fetchServerData(start, end);
      }
    } catch (error) {
      this.error('请求处理失败:', error);
    }

    handler.next(config);
  }

  /**
   * 处理响应
   */
  handleResponse(response, handler) {
    try {
      const url = response.config?.url || '';
      
      // 只处理我们关心的URL，其他的直接放行
      const shouldProcess = url && (
        url.includes(CONFIG.TARGET_URLS.OVERVIEW) ||
        url.includes(CONFIG.TARGET_URLS.CAMPAIGN_LIST) ||
        url.includes(CONFIG.TARGET_URLS.AD_GROUP_LIST) ||
        url.includes(CONFIG.TARGET_URLS.AGE_SERVICE) ||
        url.includes(CONFIG.TARGET_URLS.GENDER_SERVICE) ||
        url.includes(CONFIG.TARGET_URLS.DEVICE_SERVICE)
      );

      if (!shouldProcess) {
        // 不是我们关心的URL，直接放行
        handler.next(response);
        return;
      }

      this.log('拦截到响应URL:', url);

      // 根据URL匹配不同的处理器
      if (url.includes(CONFIG.TARGET_URLS.OVERVIEW)) {
        this.log('匹配到Overview URL，开始处理');
        this.handleOverviewResponse(response);
      } else if (url.includes(CONFIG.TARGET_URLS.CAMPAIGN_LIST)) {
        this.log('匹配到Campaign List URL，开始处理');
        this.handleCampaignListResponse(response);
      } else if (url.includes(CONFIG.TARGET_URLS.AD_GROUP_LIST)) {
        this.log('匹配到Ad Group List URL，开始处理');
        this.handleAdGroupListResponse(response);
      } else if (url.includes(CONFIG.TARGET_URLS.AGE_SERVICE)) {
        this.log('匹配到Age Service URL，开始处理');
        this.handleAgeServiceResponse(response);
      } else if (url.includes(CONFIG.TARGET_URLS.GENDER_SERVICE)) {
        this.log('匹配到Gender Service URL，开始处理');
        this.handleGenderServiceResponse(response);
      } else if (url.includes(CONFIG.TARGET_URLS.DEVICE_SERVICE)) {
        this.log('匹配到Device Service URL，开始处理');
        this.handleDeviceServiceResponse(response);
      }

    } catch (error) {
      this.error('响应处理失败:', error);
    }

    handler.next(response);
  }

  /**
   * 提取时间参数
   */
  extractTimeParams(config) {
    let start = null, end = null;

    // 从FormData提取
    if (config.body instanceof FormData) {
      start = config.body.get('cost_time_start');
      end = config.body.get('cost_time_end');
    }

    // 从JSON提取
    if (!start && typeof config.body === 'string') {
      try {
        const json = JSON.parse(config.body);
        start = json.cost_time_start || json.startDate || json.start;
        end = json.cost_time_end || json.endDate || json.end;
      } catch (e) { }
    }

    // 从URL提取
    if (!start && config.url) {
      try {
        const url = new URL(config.url, window.location.origin);
        const params = url.searchParams;
        start = params.get('cost_time_start') || params.get('startDate') || params.get('start');
        end = params.get('cost_time_end') || params.get('endDate') || params.get('end');
      } catch (e) { }
    }

    return { start, end };
  }

  /**
   * 从服务器或本地获取数据
   */
  async fetchServerData(start, end) {
    // 避免重复请求
    if (this.lastRequestParams.start === start && this.lastRequestParams.end === end) {
      this.log('相同的时间范围，跳过请求');
      return;
    }

    this.lastRequestParams.start = start;
    this.lastRequestParams.end = end;

    this.log(`📅 时间范围: ${start} 至 ${end}`);

    try {
      let data = null;

      // 根据配置选择数据源
      if (CONFIG.API.MODE === 'mock') {
        // ========== Mock 模式：从本地 JSON 加载 ==========
        this.log('🎭 Mock 模式：从本地 JSON 加载数据');
        
        if (window.mockDataLoader) {
          data = await window.mockDataLoader.load();
          
          if (data) {
            this.log('✅ Mock 数据获取成功');
          } else {
            this.error('❌ Mock 数据加载失败');
            return;
          }
        } else {
          this.error('❌ mockDataLoader 未初始化');
          return;
        }

      } else {
        // ========== API 模式：从真实服务器获取 ==========
        this.log('🌐 API 模式：从服务器获取数据');
        
        const params = new URLSearchParams({
          cost_time_start: start,
          cost_time_end: end,
          ocid: this.getQueryParam('ocid') || '',
          campaignId: this.getQueryParam('campaignId') || '',
          adGroupId: this.getQueryParam('adgroupId') || '',
          adId: this.getQueryParam('adId') || ''
        });

        const url = `${CONFIG.API.BASE_URL}${CONFIG.API.ENDPOINTS.GET_DATA}?${params}`;
        this.log('API URL:', url);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, false); // 同步请求
        xhr.timeout = CONFIG.API.TIMEOUT;
        xhr.send();

        if (xhr.status === 200 && xhr.responseText) {
          data = JSON.parse(xhr.responseText);
          this.log('✅ 服务器数据获取成功');
        } else {
          this.error(`❌ API请求失败: ${xhr.status}`);
          return;
        }
      }

      // 处理获取到的数据
      if (data) {
        this.latestServerData = data;
        
        // 保存到本地存储
        if (window.storageManager) {
          window.storageManager.save(data);
        }
        
        // 处理数据
        this.processServerData(data);
        
        this.log('✅ 数据处理完成');
      }

    } catch (error) {
      this.error('❌ 获取数据失败:', error);
    }
  }

  /**
   * 处理服务器数据
   */
  processServerData(data) {
    if (!data || !data.accountCost) {
      return;
    }

    const account = data.accountCost;

    // 基础数据
    this.adsData = {
      'stats.average_cpm': account.average_cpm,
      'stats.click_through_rate': account.click_through_rate,
      'stats.clicks': account.clicks,
      'stats.cost': account.cost,
      'stats.cost_per_click': account.cost_per_click,
      'stats.impressions': account.impressions,
      'stats.conversions': account.conversions,
      'stats.conversion_rate': account.conversion_rate,
      'stats.video_views': account.video_views
    };

    // 计算衍生数据
    this.computedData = this.calculateRatioData(account, CONFIG.DATA_RATIOS.COMPUTED);
    this.ipadData = this.calculateRatioData(account, CONFIG.DATA_RATIOS.IPAD);
    this.iphoneData = this.calculateRatioData(account, CONFIG.DATA_RATIOS.IPHONE);

    this.log('数据处理完成', {
      adsData: this.adsData,
      computedData: this.computedData
    });
  }

  /**
   * 按比例计算数据
   */
  calculateRatioData(source, ratio) {
    const result = {};
    for (let key in source) {
      if (typeof source[key] === 'number') {
        result[key] = source[key] * ratio;
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  /**
   * 处理Overview响应
   */
  handleOverviewResponse(response) {
    try {
      // 检查响应是否存在且有效
      if (!response || !response.response) {
        this.log('Overview响应为空，跳过处理');
        return;
      }

      // 检查响应内容是否为有效字符串
      if (typeof response.response !== 'string' || response.response === 'undefined') {
        this.log('Overview响应内容无效，跳过处理');
        return;
      }

      let data = JSON.parse(response.response);

      // 先清空所有数据，设置为0或空值
      this.clearOverviewData(data);

      // 如果有自定义数据，则填充自定义数据
      if (Object.keys(this.adsData).length > 0) {
        this.fillOverviewData(data);
      }

      response.response = JSON.stringify(data);
      this.log('Overview响应已修改 - 先清空后填充自定义数据');
    } catch (error) {
      this.error('处理Overview响应失败:', error);
    }
  }

  /**
   * 清空Overview数据
   */
  clearOverviewData(data) {
    try {
      // 清空折线图数据
      if (data['1'] && data['1']['1'] && data['1']['1']['2']) {
        const chartData = data['1']['1']['2'][0]['2'];
        if (chartData && chartData['1']) {
          chartData['1'] = chartData['1'].map(() => ({ 1: 0 }));
        }
      }

      // 清空统计卡片数据
      if (data['1'] && data['1']['2']) {
        const statsCards = data['1']['2'];
        if (Array.isArray(statsCards)) {
          statsCards.forEach(card => {
            if (card && card['2'] && Array.isArray(card['2'])) {
              card['2'] = card['2'].map(() => '0');
            }
          });
        }
      }

      // 清空表格数据
      if (data['2'] && Array.isArray(data['2'])) {
        data['2'].forEach(table => {
          if (table && table['2'] && Array.isArray(table['2'])) {
            table['2'].forEach(row => {
              if (Array.isArray(row)) {
                for (let i = 1; i < row.length; i++) { // 保留第一列（通常是标签）
                  row[i] = '0';
                }
              }
            });
          }
        });
      }

      this.log('Overview数据已清空');
    } catch (error) {
      this.error('清空Overview数据失败:', error);
    }
  }

  /**
   * 填充Overview自定义数据
   */
  fillOverviewData(data) {
    try {
      // 填充折线图数据
      if (data['1'] && data['1']['1'] && data['1']['1']['2']) {
        const chartData = data['1']['1']['2'][0]['2'];
        if (chartData) {
          chartData['1'] = [
            { 1: this.adsData['stats.clicks'] || 0 },
            { 1: this.adsData['stats.impressions'] || 0 },
            { 1: this.adsData['stats.cost_per_click'] || 0 },
            { 1: this.adsData['stats.cost'] || 0 }
          ];
        }
      }

      // 填充统计卡片数据
      if (data['1'] && data['1']['2']) {
        const statsCards = data['1']['2'];
        if (Array.isArray(statsCards)) {
          statsCards.forEach((card, index) => {
            if (card && card['2'] && Array.isArray(card['2'])) {
              // 根据卡片位置填充不同的数据
              switch (index) {
                case 0: // 点击次数
                  card['2'][0] = (this.adsData['stats.clicks'] || 0).toString();
                  break;
                case 1: // 展示次数
                  card['2'][0] = (this.adsData['stats.impressions'] || 0).toString();
                  break;
                case 2: // 费用
                  card['2'][0] = (this.adsData['stats.cost'] || 0).toString();
                  break;
                case 3: // 转化次数
                  card['2'][0] = (this.adsData['stats.conversions'] || 0).toString();
                  break;
              }
            }
          });
        }
      }

      this.log('Overview自定义数据已填充');
    } catch (error) {
      this.error('填充Overview数据失败:', error);
    }
  }

  /**
   * 处理广告系列列表响应
   */
  handleCampaignListResponse(response) {
    try {
      // 检查响应是否存在且有效
      if (!response || !response.response) {
        this.log('广告系列列表响应为空，跳过处理');
        return;
      }

      // 检查响应内容是否为有效字符串
      if (typeof response.response !== 'string' || response.response === 'undefined') {
        this.log('广告系列列表响应内容无效，跳过处理');
        return;
      }

      let data = JSON.parse(response.response);

      // 检查数据结构
      if (!data || !data['2'] || !data['2'][0]) {
        this.log('广告系列列表数据结构不符合预期，跳过处理');
        return;
      }

      // 解析批量响应
      let campaigns = JSON.parse(data['2'][0]);

      if (campaigns['1']) {
        campaigns['1'].forEach((campaign, index) => {
          // 修改每个广告系列的统计数据
          if (campaign['200'] && campaign['200']['1']) {
            campaign['200']['1'] = this.calculateStats(
              campaigns['2']['2'],
              campaign['200']['1']
            );
          }
        });
      }

      data['2'][0] = JSON.stringify(campaigns);
      response.response = JSON.stringify(data);

      this.log('广告系列列表响应已修改');
    } catch (error) {
      this.error('处理广告系列列表响应失败:', error);
    }
  }

  /**
   * 处理广告组列表响应
   */
  handleAdGroupListResponse(response) {
    try {
      // 检查响应是否存在且有效
      if (!response || !response.response) {
        this.log('广告组列表响应为空，跳过处理');
        return;
      }

      // 检查响应内容是否为有效字符串
      if (typeof response.response !== 'string' || response.response === 'undefined') {
        this.log('广告组列表响应内容无效，跳过处理');
        return;
      }

      let data = JSON.parse(response.response);

      // 检查数据结构
      if (!data || !data['2'] || !data['2'][0]) {
        this.log('广告组列表数据结构不符合预期，跳过处理');
        return;
      }

      let adGroups = JSON.parse(data['2'][0]);

      if (adGroups['1']) {
        adGroups['1'].forEach((adGroup, index) => {
          if (adGroup['200'] && adGroup['200']['1']) {
            adGroup['200']['1'] = this.calculateStats(
              adGroups['2']['2'],
              adGroup['200']['1']
            );
          }
        });
      }

      data['2'][0] = JSON.stringify(adGroups);
      response.response = JSON.stringify(data);

      this.log('广告组列表响应已修改');
    } catch (error) {
      this.error('处理广告组列表响应失败:', error);
    }
  }

  /**
   * 计算统计数据
   */
  calculateStats(orderConfig, originalValues) {
    if (!orderConfig || orderConfig.length === 0) {
      return originalValues;
    }

    const indices = orderConfig.map(config => config['3']);
    const result = [];

    indices.forEach((fieldPath, index) => {
      const value = this.adsData[fieldPath];
      result.push(
        value !== undefined
          ? (typeof value === 'string' ? value : value.toString())
          : originalValues[index]
      );
    });

    return result;
  }

  /**
   * 处理年龄服务响应
   */
  handleAgeServiceResponse(response) {
    this.log('处理年龄服务响应');
    // 实现类似的数据修改逻辑
  }

  /**
   * 处理性别服务响应
   */
  handleGenderServiceResponse(response) {
    this.log('处理性别服务响应');
    // 实现类似的数据修改逻辑
  }

  /**
   * 处理设备服务响应
   */
  handleDeviceServiceResponse(response) {
    this.log('处理设备服务响应');
    // 实现类似的数据修改逻辑
  }

  /**
   * 获取URL参数
   */
  getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || '';
  }

  // 日志方法
  log(...args) {
    if (CONFIG.DEBUG) {
      console.log('[RequestInterceptor]', ...args);
    }
  }

  error(...args) {
    console.error('[RequestInterceptor]', ...args);
  }
}

// 导出实例
window.requestInterceptor = new RequestInterceptor();