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
    this.modifyExistingStats();
    this.log('DOM处理器已启动');
  }

  /**
   * 修改页面上已存在的统计数值
   */
  modifyExistingStats() {
    // 延迟执行，确保页面元素已加载
    setTimeout(() => {
      this.updateAllMetrics();
    }, 1000);
  }

  /**
   * 更新所有指标
   */
  updateAllMetrics() {
    const mockData = this.getMockData();
    if (!mockData) return;

    // 1. 点击次数
    this.updateMetric('点击次数', mockData.clicks);

    // 2. 展示次数
    this.updateMetric('展示次数', mockData.impressions);

    // 3. 平均每次点击费用
    this.updateMetric('平均每次点击费用', mockData.cost_per_click, true);

    // 4. 费用
    this.updateMetric('费用', mockData.cost, true);
  }

  /**
   * 更新单个指标
   */
  updateMetric(metricName, value, isCurrency = false) {
    if (!value) return;

    const containers = document.querySelectorAll(`.stats[aria-label*="${metricName}"]`);
    containers.forEach(container => {
      const statElement = container.querySelector('.stat.label-value');
      if (statElement) {
        if (isCurrency) {
          statElement.textContent = `$${this.formatNumber(value)}`;
          statElement.setAttribute('title', `US$${this.formatNumberWithComma(value)}`);
        } else {
          statElement.textContent = this.formatNumber(value);
          statElement.setAttribute('title', this.formatNumberWithComma(value));
        }
        this.log(`已修改${metricName}: -> ${value}`);
      }
    });
  }

  /**
   * 从 mock 数据获取账户数据
   */
  getMockData() {
    if (window.mockDataLoader) {
      const accountData = window.mockDataLoader.getData('account');
      if (accountData) {
        return accountData;
      }
    }
    // 如果无法获取，返回默认值
    return {
      clicks: 2580,
      impressions: 61428,
      cost_per_click: 4.91,
      cost: 12680.50
    };
  }

  /**
   * 格式化数字（不带逗号）
   */
  formatNumber(num) {
    return num.toString();
  }

  /**
   * 格式化数字（带逗号）
   */
  formatNumberWithComma(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

    // 修改统计数值
    this.modifyStatValues(node);

    // 隐藏只读按钮
    this.hideReadonlyButtons(node);
  }

  /**
   * 修改统计数值
   */
  modifyStatValues(node) {
    if (!node.querySelectorAll) return;

    const mockData = this.getMockData();
    if (!mockData) return;

    // 1. 点击次数
    const clickContainers = node.querySelectorAll('.stats[aria-label*="点击次数"]');
    clickContainers.forEach(container => {
      const statElement = container.querySelector('.stat.label-value');
      if (statElement) {
        statElement.textContent = this.formatNumber(mockData.clicks);
        statElement.setAttribute('title', this.formatNumberWithComma(mockData.clicks));
        this.log(`统计数值已修改: 点击次数 -> ${mockData.clicks}`);
      }
    });

    // 2. 展示次数
    const impressionContainers = node.querySelectorAll('.stats[aria-label*="展示次数"]');
    impressionContainers.forEach(container => {
      const statElement = container.querySelector('.stat.label-value');
      if (statElement) {
        statElement.textContent = this.formatNumber(mockData.impressions);
        statElement.setAttribute('title', this.formatNumberWithComma(mockData.impressions));
        this.log(`统计数值已修改: 展示次数 -> ${mockData.impressions}`);
      }
    });

    // 3. 平均每次点击费用
    const cpcContainers = node.querySelectorAll('.stats[aria-label*="平均每次点击费用"]');
    cpcContainers.forEach(container => {
      const statElement = container.querySelector('.stat.label-value');
      if (statElement) {
        statElement.textContent = `$${this.formatNumber(mockData.cost_per_click)}`;
        statElement.setAttribute('title', `US$${this.formatNumberWithComma(mockData.cost_per_click)}`);
        this.log(`统计数值已修改: 平均每次点击费用 -> $${mockData.cost_per_click}`);
      }
    });

    // 4. 费用
    const costContainers = node.querySelectorAll('.stats[aria-label*="费用"]');
    costContainers.forEach(container => {
      const statElement = container.querySelector('.stat.label-value');
      if (statElement) {
        statElement.textContent = `$${this.formatNumber(mockData.cost)}`;
        statElement.setAttribute('title', `US$${this.formatNumberWithComma(mockData.cost)}`);
        this.log(`统计数值已修改: 费用 -> $${mockData.cost}`);
      }
    });
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