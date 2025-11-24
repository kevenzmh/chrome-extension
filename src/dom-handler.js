/**
 * DOM元素处理器
 */
class DOMHandler {
  constructor() {
    this.hiddenElements = CONFIG.HIDDEN_ELEMENTS;
    this.init();
  }

  /**
   * 初始化DOM处理
   */
  init() {
    this.hookNodeMethods();
    this.observeDOM();
    this.monitorDatePicker();
    this.log('DOM处理器已启动');
  }

  /**
   * 劫持Node原型方法
   */
  hookNodeMethods() {
    const self = this; // 保存DOMHandler实例的引用
    
    // 劫持appendChild
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function(node) {
      self.processNode(node);
      return originalAppendChild.call(this, node); // this指向调用appendChild的DOM节点
    };

    // 劫持insertBefore
    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function(newNode, referenceNode) {
      self.processNode(newNode);
      return originalInsertBefore.call(this, newNode, referenceNode); // this指向调用insertBefore的DOM节点
    };

    this.log('Node方法已劫持');
  }

  /**
   * 处理节点
   */
  processNode(node) {
    if (!node || !node.tagName) return;

    // 隐藏指定元素
    if (this.hiddenElements.includes(node.tagName)) {
      node.style.display = 'none';
      this.log(`隐藏元素: ${node.tagName}`);
      return;
    }

    // 修改账户信息
    const accountInfo = node.querySelector(CONFIG.SELECTORS.ACCOUNT_INFO);
    if (accountInfo) {
      accountInfo.textContent = '自定义账户名称';
      this.log('账户信息已修改');
    }

    // 隐藏只读按钮
    this.hideReadonlyButtons(node);
  }

  /**
   * 隐藏只读权限按钮
   */
  hideReadonlyButtons(node) {
    if (!node.querySelectorAll) return;

    const readonlyButtons = node.querySelectorAll(
      'material-fab[class*="is-disabled"][aria-label*="只读权限"]'
    );

    readonlyButtons.forEach(button => {
      button.removeAttribute('disabled');
      button.classList.remove('is-disabled');
      button.setAttribute('aria-disabled', 'false');
      button.setAttribute('tabindex', '0');
      button.setAttribute('aria-label', '已启用');
    });
  }

  /**
   * 监听DOM变化
   */
  observeDOM() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              this.processNode(node);
            }
          });
        }
      });
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });

    this.log('DOM观察器已启动');
  }

  /**
   * 监听日期选择器
   */
  monitorDatePicker() {
    let lastText = '';

    const checkDatePicker = () => {
      const picker = document.querySelector(CONFIG.SELECTORS.DATE_PICKER);
      if (!picker) return;

      const dateText = picker.textContent;
      if (dateText === lastText) return;

      lastText = dateText;

      // 解析日期范围: 2024年10月1日 – 10月31日
      const match = dateText.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日\s*–\s*(\d{1,2})日/);
      if (match) {
        const year = match[1];
        const month = match[2].padStart(2, '0');
        const startDay = match[3].padStart(2, '0');
        const endDay = match[4].padStart(2, '0');

        const startDate = `${year}-${month}-${startDay}`;
        const endDate = `${year}-${month}-${endDay}`;

        this.log('检测到日期变化:', { startDate, endDate });

        // 触发数据获取
        if (window.requestInterceptor) {
          window.requestInterceptor.fetchServerData(startDate, endDate);
        }
      }
    };

    // 定时检查
    setInterval(checkDatePicker, 300);
  }

  // 日志方法
  log(...args) {
    if (CONFIG.DEBUG) {
      console.log('[DOMHandler]', ...args);
    }
  }
}

// 导出实例
window.domHandler = new DOMHandler();