# 更新日志

所有重要的项目变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2025-11-25

### 新增
- ✨ 初始版本发布
- 🎯 HTTP 请求拦截功能
- 📊 数据可视化修改
- 🎭 Mock 数据支持
- 🔒 代码压缩和混淆
- 🚀 Webpack 构建系统
- 📝 完整的项目文档

### 功能特性

#### 核心功能
- HTTP 请求拦截和响应修改
- DOM 元素自动修改
- Mock 数据加载和缓存
- 时间序列图表数据处理

#### 支持的服务
- OverviewService - 概览页面数据
- CampaignService - 广告系列数据
- AdGroupAdService - 广告组数据
- AgeService - 年龄维度数据
- GenderService - 性别维度数据
- DeviceService - 设备维度数据

#### 数据修改
- 点击次数自动更新
- 展示次数自动更新
- 平均每次点击费用修改
- 费用总计修改
- 时序图表数据注入

#### 开发工具
- 开发模式文件监听
- 生产模式代码混淆
- 自动打包成 ZIP
- 调试日志系统
- 错误过滤机制

### 项目结构
- 📁 重组代码目录结构
  - `src/core/` - 核心模块
  - `src/handlers/` - 处理器模块
  - `src/utils/` - 工具模块
  - `src/services/` - 服务模块

### 文档
- 📖 README.md - 项目说明
- 📖 QUICK_START.md - 快速开始指南
- 📖 BUILD_GUIDE.md - 构建指南
- 📖 PROJECT_STRUCTURE.md - 项目结构说明
- 📖 DEBUG_CHART.md - 图表调试指南
- 📖 CHANGELOG.md - 更新日志

### 配置
- ⚙️ Webpack 构建配置
- ⚙️ Babel 转译配置
- ⚙️ Git 忽略配置
- ⚙️ 扩展 Manifest 配置

### 技术栈
- Webpack 5.103.0
- Babel 7.23.0
- Terser (代码压缩)
- ajaxhook (请求拦截)

---

## 版本说明

### 版本号格式：主版本号.次版本号.修订号

- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

### 变更类型

- `新增` - 新功能
- `变更` - 现有功能的变更
- `废弃` - 即将移除的功能
- `移除` - 已移除的功能
- `修复` - Bug 修复
- `安全` - 安全相关的修复

---

## 未来计划

### [1.1.0] - 计划中
- [ ] 添加 TypeScript 支持
- [ ] 添加单元测试
- [ ] 添加 ESLint 代码检查
- [ ] 添加 Prettier 代码格式化
- [ ] 支持更多 Google Ads 服务
- [ ] 添加配置界面（Popup）
- [ ] 支持多账户切换

### [1.2.0] - 计划中
- [ ] 添加数据导出功能
- [ ] 添加数据对比功能
- [ ] 支持自定义规则
- [ ] 添加性能监控
- [ ] 优化构建速度

---

## 贡献指南

如果你想为这个项目做出贡献：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

---

## 问题反馈

如果你发现了 Bug 或有功能建议，请：

1. 查看 [Issues](https://github.com/yourusername/excellent-master-extension/issues) 是否已有相关问题
2. 如果没有，创建一个新的 Issue
3. 详细描述问题或建议
4. 如果是 Bug，请提供复现步骤

---

**注意**：本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。
