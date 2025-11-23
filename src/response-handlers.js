/**
 * 响应处理器集合
 */
class ResponseHandlers {
  constructor() {
    this.processor = window.dataProcessor;
  }

  /**
   * 处理概览页面响应
   */
  handleOverview(response) {
    try {
      const data = this.processor.safeJsonParse(response.response);
      if (!data) return;

      // 修改折线图数据
      if (this.hasPath(data, '1.1.2.0.2')) {
        const chartSection = data['1']['1']['2'][0]['2'];
        const statsData = window.requestInterceptor.adsData;

        chartSection['1'] = [
          { 1: statsData['stats.clicks'] },
          { 1: statsData['stats.impressions'] },
          { 1: statsData['stats.cost_per_click'] },
          { 1: statsData['stats.cost'] }
        ];

        chartSection['3'] = [
          statsData['stats.clicks'],
          statsData['stats.impressions'],
          statsData['stats.cost_per_click'],
          statsData['stats.cost']
        ];

        chartSection['13'] = [
          {
            1: { 1: statsData['stats.clicks'] },
            3: statsData['stats.clicks'],
            5: { 1: 1, 2: 'clicks' }
          },
          {
            1: { 1: statsData['stats.impressions'] },
            3: statsData['stats.impressions'],
            5: { 1: 1, 2: 'impressions' }
          },
          {
            1: { 1: statsData['stats.cost_per_click'] },
            3: statsData['stats.cost_per_click'],
            5: { 1: 1, 2: 'cost_per_click' }
          },
          {
            1: { 1: statsData['stats.cost'] },
            3: statsData['stats.cost'],
            5: { 1: 1, 2: 'cost' }
          }
        ];
      }

      // 修改广告系列效果摘要
      if (this.hasPath(data, '1.1.2')) {
        data['1']['1']['2'].forEach(section => {
          if (section['4'] && section['4']['1']) {
            section['4']['1'].forEach((summary, index) => {
              summary['2'] = `广告系列效果摘要${index + 1}`;
              summary['9'] = [5717317, 65, 0.4];
              summary['17'] = [5717317, 65, 0.4];
            });
          }
        });
      }

      response.response = this.processor.safeJsonStringify(data);
      this.log('概览响应已处理');
    } catch (error) {
      this.error('处理概览响应失败:', error);
    }
  }

  /**
   * 处理广告系列列表响应
   */
  handleCampaignList(response) {
    try {
      const wrapper = this.processor.safeJsonParse(response.response);
      if (!wrapper || !wrapper['2']) return;

      const campaigns = this.processor.safeJsonParse(wrapper['2'][0]);
      const adGroups = this.processor.safeJsonParse(wrapper['2'][1]);
      const ads = this.processor.safeJsonParse(wrapper['2'][2]);

      // 处理广告系列
      if (campaigns['1']) {
        campaigns['1'].forEach((campaign, index) => {
          this.enhanceCampaign(campaign, campaigns['2']['2'], index);
        });
      }

      // 处理广告组
      if (adGroups['1']) {
        adGroups['1'].forEach((adGroup, index) => {
          this.enhanceAdGroup(adGroup, adGroups['2']['2'], index);
        });
      }

      // 处理广告
      if (ads['1']) {
        ads['1'].forEach((ad, index) => {
          this.enhanceAd(ad, ads['2']['2'], index);
        });
      }

      wrapper['2'][0] = this.processor.safeJsonStringify(campaigns);
      wrapper['2'][1] = this.processor.safeJsonStringify(adGroups);
      wrapper['2'][2] = this.processor.safeJsonStringify(ads);

      response.response = this.processor.safeJsonStringify(wrapper);
      this.log('广告系列列表响应已处理');
    } catch (error) {
      this.error('处理广告系列列表响应失败:', error);
    }
  }

  /**
   * 增强广告系列数据
   */
  enhanceCampaign(campaign, orderConfig, index) {
    const budget = window.requestInterceptor.latestServerData?.campaignCost?.[0]?.budget || '10000';

    campaign['11'] = budget.toString();
    campaign['200']['1'] = this.processor.calculateAdStats(
      orderConfig,
      campaign['200']['1'],
      window.requestInterceptor.adsData
    );
  }

  /**
   * 增强广告组数据
   */
  enhanceAdGroup(adGroup, orderConfig, index) {
    adGroup['200']['1'] = this.processor.calculateAdStats(
      orderConfig,
      adGroup['200']['1'],
      window.requestInterceptor.adsData
    );
  }

  /**
   * 增强广告数据
   */
  enhanceAd(ad, orderConfig, index) {
    const serverData = window.requestInterceptor.latestServerData;
    
    ad['5'] = serverData?.adCost?.[0]?.status === 1 ? 1 : 2;
    ad['58'] = serverData?.adCost?.[0]?.primary_status ? 1 : 7;
    
    ad['200']['1'] = this.processor.calculateAdStats(
      orderConfig,
      ad['200']['1'],
      window.requestInterceptor.adsData
    );
  }

  /**
   * 处理年龄服务响应
   */
  handleAgeService(response) {
    try {
      const data = this.processor.safeJsonParse(response.response);
      if (!data || !data['1']) return;

      const ageMapping = {
        'Undetermined': '未确定',
        'gt64': '64岁以上',
        '55to64': '55-64岁',
        '45to54': '45-54岁',
        '35to44': '35-44岁',
        '25to34': '25-34岁',
        '18to24': '18-24岁'
      };

      data['1'].forEach((ageGroup, index) => {
        const ageType = ageGroup['5'];
        ageGroup['2'] = ageMapping[ageType] || ageType;
        
        if (!ageGroup['200']) {
          ageGroup['200'] = { '1': [] };
        }
        
        // 使用折线图点击数
        const clicks = window.requestInterceptor.latestServerData?.accountCostChart?.[0]?.clicks || 0;
        ageGroup['200']['1'] = [clicks.toString()];
      });

      response.response = this.processor.safeJsonStringify(data);
      this.log('年龄服务响应已处理');
    } catch (error) {
      this.error('处理年龄服务响应失败:', error);
    }
  }

  /**
   * 处理性别服务响应
   */
  handleGenderService(response) {
    try {
      const data = this.processor.safeJsonParse(response.response);
      if (!data || !data['1']) return;

      const audiencesGender = window.requestInterceptor.audiencesGender || [];

      data['1'].forEach((genderGroup, index) => {
        if (index < audiencesGender.length) {
          genderGroup['200']['1'] = this.processor.calculateAdStats(
            data['2']['2'],
            genderGroup['200']['1'],
            audiencesGender[index]
          );
        }
      });

      response.response = this.processor.safeJsonStringify(data);
      this.log('性别服务响应已处理');
    } catch (error) {
      this.error('处理性别服务响应失败:', error);
    }
  }

  /**
   * 处理设备服务响应
   */
  handleDeviceService(response) {
    try {
      const wrapper = this.processor.safeJsonParse(response.response);
      if (!wrapper || !wrapper['2']) return;

      const devices = this.processor.safeJsonParse(wrapper['2'][0]);
      
      if (devices['1']) {
        devices['1'].forEach((device, index) => {
          const deviceType = device['4'];
          let deviceData;

          switch (deviceType) {
            case '20000':
              deviceData = window.requestInterceptor.ipadData;
              break;
            case '30000':
              deviceData = window.requestInterceptor.iphoneData;
              break;
            default:
              deviceData = window.requestInterceptor.computedData;
          }

          device['200']['1'] = this.processor.calculateAdStats(
            devices['2']['2'],
            device['200']['1'],
            deviceData
          );
        });
      }

      wrapper['2'][0] = this.processor.safeJsonStringify(devices);
      response.response = this.processor.safeJsonStringify(wrapper);
      
      this.log('设备服务响应已处理');
    } catch (error) {
      this.error('处理设备服务响应失败:', error);
    }
  }

  /**
   * 处理账单摘要响应
   */
  handleBillingSummary(response) {
    try {
      const data = this.processor.safeJsonParse(response.response);
      if (!data) return;

      const bill = window.requestInterceptor.latestServerData?.bill;

      if (bill) {
        // 修改账户余额
        data['1']['1']['1'] = `${data['1']['1']['1'].match(/[A-Z]+/)[0]}${bill.balance || '100000'}`;
        data['1']['1']['2'] = bill.last_payment_date || '20251005073601';
        data['1']['6'] = true;
        data['1']['12'] = '999999999';
        data['1']['13'] = '888999999';
      }

      response.response = this.processor.safeJsonStringify(data);
      this.log('账单摘要响应已处理');
    } catch (error) {
      this.error('处理账单摘要响应失败:', error);
    }
  }

  /**
   * 处理交易摘要响应
   */
  handleTransactionsSummary(response) {
    try {
      const data = this.processor.safeJsonParse(response.response);
      if (!data) return;

      const bill = window.requestInterceptor.latestServerData?.bill;

      if (data['1']) {
        data['1'].forEach((transaction, index) => {
          if (index === data['1'].length - 1) {
            transaction['4'] = `支付成功 - ¥${bill?.last_payment_amount || '20000'}`;
            transaction['5'] = bill?.last_payment_amount?.toString() || '20000';
            transaction['3'] = `-${bill?.balance || '0'}`;
          }
        });
      }

      if (data['3']) {
        data['3'].forEach((summary, index) => {
          summary['4'] = bill?.balance?.toString() || '1500000';
          summary['2'] = '本期账单';
          summary['3'] = '42500000';
          summary['7'] = bill?.last_payment_amount?.toString() || '258583310000';
        });
      }

      response.response = this.processor.safeJsonStringify(data);
      this.log('交易摘要响应已处理');
    } catch (error) {
      this.error('处理交易摘要响应失败:', error);
    }
  }

  /**
   * 检查对象是否有指定路径
   */
  hasPath(obj, path) {
    return path.split('.').every((key, index, arr) => {
      if (obj === null || obj === undefined) return false;
      obj = obj[key];
      return index === arr.length - 1 ? obj !== undefined : true;
    });
  }

  // 日志方法
  log(...args) {
    if (CONFIG.DEBUG) {
      console.log('[ResponseHandlers]', ...args);
    }
  }

  error(...args) {
    console.error('[ResponseHandlers]', ...args);
  }
}

// 导出实例
window.responseHandlers = new ResponseHandlers();