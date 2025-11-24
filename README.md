# Excellent Master - Chrome Extension

> Google Ads 数据管理插件，支持数据拦截、修改和 Mock 数据注入

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/excellent-master-extension)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ 特性

- 🎯 **HTTP 请求拦截** - 拦截并修改 Google Ads API 响应
- 📊 **数据可视化修改** - 自动修改页面上的统计数据和图表
- 🎭 **Mock 数据支持** - 支持本地 JSON 数据或真实 API
- 🔒 **代码加密** - 生产构建自动压缩和混淆代码
- 🚀 **现代化构建** - 使用 Webpack + Babel 构建系统
- 🛠️ **开发友好** - 支持热重载和调试模式

## 📦 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 打包发布

```bash
npm run build:zip
```

## 📖 文档

- [快速开始指南](./docs/QUICK_START.md) - 5 分钟上手
- [构建指南](./docs/BUILD_GUIDE.md) - 详细的构建配置说明
- [项目结构](./docs/PROJECT_STRUCTURE.md) - 代码组织和模块说明
- [图表调试](./docs/DEBUG_CHART.md) - 如何调试悬浮图表
- [贡献指南](./docs/CONTRIBUTING.md) - 如何参与贡献
- [更新日志](./docs/CHANGELOG.md) - 版本历史
- [待办事项](./docs/TODO.md) - 开发计划

## 🏗️ 项目结构

```
src/
├── core/          # 核心模块（配置、主逻辑、入口）
├── handlers/      # 处理器（拦截器、响应处理、DOM 处理）
├── utils/         # 工具函数（存储、数据处理）
└── services/      # 服务（Mock 数据加载）
```

## 🔧 配置

### 数据模式切换

在 `src/core/config.js` 中修改：

```javascript
API: {
  MODE: 'mock'  // 'mock' = 本地数据, 'api' = 真实 API
}
```

### Mock 数据

编辑 `data/mock-data.json` 文件来自定义数据。

### 调试模式

```javascript
DEBUG: true  // 开启调试日志
```

## 🚀 使用方法

### 1. 加载扩展

1. 运行 `npm run build`
2. 打开 Chrome 浏览器
3. 访问 `chrome://extensions/`
4. 启用"开发者模式"
5. 点击"加载已解压的扩展程序"
6. 选择 `dist` 目录

### 2. 访问 Google Ads

访问 Google Ads 页面，扩展会自动：
- 拦截 API 请求
- 注入 Mock 数据
- 修改页面显示

### 3. 查看效果

- 统计数值会显示 Mock 数据
- 图表会根据时间序列数据更新
- 控制台会显示调试信息（DEBUG 模式）

## 📊 功能说明

### 数据拦截

自动拦截以下 API：
- OverviewService - 概览页面
- CampaignService - 广告系列
- AdGroupAdService - 广告组
- AgeService - 年龄数据
- GenderService - 性别数据
- DeviceService - 设备数据

### DOM 修改

自动修改页面元素：
- 点击次数
- 展示次数
- 平均每次点击费用
- 费用总计
- 时序图表

### 数据来源

支持两种数据模式：
1. **Mock 模式** - 从 `data/mock-data.json` 读取
2. **API 模式** - 从真实服务器获取

## 🛠️ 开发

### 添加新功能

1. **添加新的 URL 拦截**
   - 编辑 `src/core/config.js` 的 `TARGET_URLS`
   - 在 `src/handlers/interceptor.js` 添加处理逻辑

2. **添加新的响应处理**
   - 在 `src/handlers/response-handlers.js` 添加方法

3. **添加新的 DOM 修改**
   - 在 `src/handlers/dom-handler.js` 添加逻辑

### 代码规范

- 使用 ES6+ 语法
- 类和方法添加 JSDoc 注释
- 统一的错误处理和日志格式

## 📝 脚本命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发模式（监听文件变化） |
| `npm run build` | 生产构建（压缩混淆） |
| `npm run build:zip` | 构建并打包成 ZIP |
| `npm run clean` | 清理构建文件 |

## 🔒 代码保护

生产构建会自动：
- ✅ 压缩代码
- ✅ 混淆变量名
- ✅ 移除注释
- ✅ 移除 console.log
- ✅ 不生成 source map

## 🐛 调试

### 查看日志

在 `src/core/config.js` 中设置：
```javascript
DEBUG: true
```

### 过滤错误

配置 `CONSOLE_FILTER` 来过滤不需要的错误信息。

### 查看拦截的请求

所有拦截的请求会在控制台显示（DEBUG 模式）。

## 📦 构建输出

```
dist/
├── js/              # 压缩后的 JavaScript
├── data/            # Mock 数据
├── icons/           # 图标
├── lib/             # 第三方库
└── manifest.json    # 扩展配置
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👤 作者

fs

## 🙏 致谢

- [ajaxhook](https://github.com/wendux/ajax-hook) - HTTP 请求拦截库
- [Webpack](https://webpack.js.org/) - 模块打包工具
- [Babel](https://babeljs.io/) - JavaScript 编译器

## 📮 联系方式

如有问题，请提交 Issue 或联系作者。

---

⭐ 如果这个项目对你有帮助，请给个 Star！
