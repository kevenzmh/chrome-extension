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
    if (!window.ah) {
      this.error('ajaxhook库未加载');
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

    this.log('请求拦截器已启动');
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
      const url = response.config.url;
      
      // 根据URL匹配不同的处理器
      if (url.includes(CONFIG.TARGET_URLS.OVERVIEW)) {
        this.handleOverviewResponse(response);
      } else if (url.includes(CONFIG.TARGET_URLS.CAMPAIGN_LIST)) {
        this.handleCampaignListResponse(response);
      } else if (url.includes(CONFIG.TARGET_URLS.AD_GROUP_LIST)) {
        this.handleAdGroupListResponse(response);
      } else if (url.includes(CONFIG.TARGET_URLS.AGE_SERVICE)) {
        this.handleAgeServiceResponse(response);
      } else if (url.includes(CONFIG.TARGET_URLS.GENDER_SERVICE)) {
        this.handleGenderServiceResponse(response);
      } else if (url.includes(CONFIG.TARGET_URLS.DEVICE_SERVICE)) {
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
      } catch (e) {}
    }

    // 从URL提取
    if (!start && config.url) {
      try {
        const url = new URL(config.url, window.location.origin);
        const params = url.searchParams;
        start = params.get('cost_time_start') || params.get('startDate') || params.get('start');
        end = params.get('cost_time_end') || params.get('endDate') || params.get('end');
      } catch (e) {}
    }

    return { start, end };
  }

  /**
   * 从服务器获取数据
   */
  async fetchServerData(start, end) {
    // 避免重复请求
    if (this.lastRequestParams.start === start && this.lastRequestParams.end === end) {
      return;
    }

    this.lastRequestParams.start = start;
    this.lastRequestParams.end = end;

    try {
      const params = new URLSearchParams({
        cost_time_start: start,
        cost_time_end: end,
        ocid: this.getQueryParam('ocid'),
        campaignId: this.getQueryParam('campaignId'),
        adGroupId: this.getQueryParam('adgroupId'),
        adId: this.getQueryParam('adId') || ''
      });

      const url = `${CONFIG.API.BASE_URL}${CONFIG.API.ENDPOINTS.GET_DATA}?${params}`;
      
      this.log('请求服务器数据:', url);

      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, false); // 同步请求
      xhr.send();

      if (xhr.status === 200 && xhr.responseText) {
        const data = JSON.parse(xhr.responseText);
        this.latestServerData = data;
        
        // 保存到本地存储
        window.storageManager.save(data);
        
        // 处理数据
        this.processServerData(data);
        
        this.log('服务器数据获取成功');
      }
    } catch (error) {
      this.error('获取服务器数据失败:', error);
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
      let data = JSON.parse(response.response);
      
      // 修改折线图数据
      if (data['1'] && data['1']['1'] && data['1']['1']['2']) {
        const chartData = data['1']['1']['2'][0]['2'];
        if (chartData) {
          chartData['1'] = [
            {1: this.adsData['stats.clicks']},
            {1: this.adsData['stats.impressions']},
            {1: this.adsData['stats.cost_per_click']},
            {1: this.adsData['stats.cost']}
          ];
        }
      }

      response.response = JSON.stringify(data);
      this.log('Overview响应已修改');
    } catch (error) {
      this.error('处理Overview响应失败:', error);
    }
  }

  /**
   * 处理广告系列列表响应
   */
  handleCampaignListResponse(response) {
    try {
      let data = JSON.parse(response.response);
      
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
      let data = JSON.parse(response.response);
      
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