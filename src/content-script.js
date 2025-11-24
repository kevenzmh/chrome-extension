/**
 * Content Script 入口 - 验证模式
 */
(function() {
  console.log('%c[ContentScript] 🚀 启动验证', 'color: #4CAF50; font-weight: bold');

  // 设置控制台错误过滤
  if (CONFIG?.CONSOLE_FILTER?.ENABLED) {
    const originalError = console.error;
    console.error = function(...args) {
      const message = args.join(' ');
      const shouldFilter = CONFIG.CONSOLE_FILTER.FILTERED_ERRORS.some(keyword => 
        message.includes(keyword)
      );
      
      if (!shouldFilter) {
        originalError.apply(console, args);
      }
    };
    console.log('%c[ContentScript] 控制台错误过滤已启用', 'color: #FF9800');
  }

  // 验证关键对象
  const requiredObjects = {
    'CONFIG': '配置对象',
    'Utils': '工具函数',
    'storageManager': '存储管理器',
    'dataProcessor': '数据处理器',
    'requestInterceptor': '请求拦截器',
    'responseHandlers': '响应处理器',
    'domHandler': 'DOM处理器',
    'mainLogic': '主逻辑'
  };

  let allLoaded = true;
  
  Object.keys(requiredObjects).forEach(key => {
    if (window[key]) {
      console.log(`%c✅ ${requiredObjects[key]} (${key})`, 'color: green');
    } else {
      console.error(`%c❌ ${requiredObjects[key]} (${key}) 未加载`, 'color: red; font-weight: bold');
      allLoaded = false;
    }
  });

  if (allLoaded) {
    console.log('%c[ContentScript] ✅ 所有模块加载成功！', 'color: #4CAF50; font-weight: bold; font-size: 14px');
  } else {
    console.error('%c[ContentScript] ❌ 部分模块加载失败！请检查控制台', 'color: red; font-weight: bold; font-size: 14px');
  }

  // 显示版本信息
  console.log(`%c[ContentScript] 插件版本: 1.0.0 | 调试模式: ${CONFIG?.DEBUG || false}`, 'color: #2196F3');
  
  // 显示API配置
  if (CONFIG?.API?.BASE_URL) {
    console.log(`%c[ContentScript] API地址: ${CONFIG.API.BASE_URL}`, 'color: #FF9800');
  }
  
  window.__CONTENT_SCRIPT_LOADED__ = true;
})();
