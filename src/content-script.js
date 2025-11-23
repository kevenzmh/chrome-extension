/**
 * Content Script 入口
 */
class ContentScriptManager {
  constructor() {
    this.log('Content Script 管理器启动');
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    // 注入脚本到页面上下文
    this.injectScripts();
  }

  /**
   * 注入脚本
   */
  injectScripts() {
    const scripts = [
      'lib/ajaxhook.min.js',
      'src/main-logic.js'
    ];

    scripts.forEach((scriptPath, index) => {
      setTimeout(() => {
        this.injectScript(scriptPath);
      }, index * 100); // 延迟注入，确保顺序
    });
  }

  /**
   * 注入单个脚本
   */
  injectScript(path) {
    try {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL(path);
      script.async = false;
      
      script.onload = () => {
        script.remove();
        this.log(`脚本已注入: ${path}`);
      };

      script.onerror = () => {
        this.error(`脚本注入失败: ${path}`);
      };

      (document.head || document.documentElement).appendChild(script);
    } catch (error) {
      this.error('注入脚本失败:', error);
    }
  }

  // 日志方法
  log(...args) {
    console.log('[ContentScriptManager]', ...args);
  }

  error(...args) {
    console.error('[ContentScriptManager]', ...args);
  }
}

// 启动管理器
window.__CONTENT_SCRIPT_MANAGER__ = new ContentScriptManager();