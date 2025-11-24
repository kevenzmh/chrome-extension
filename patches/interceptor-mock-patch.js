/**
 * interceptor.js 修改指南
 * 
 * 找到 fetchServerData 方法（约第160行），将整个方法替换为以下代码：
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
