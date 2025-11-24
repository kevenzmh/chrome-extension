# 项目结构

## 📁 目录结构

```
excellent-master-extension/
├── src/                          # 源代码目录
│   ├── core/                     # 核心模块
│   │   ├── config.js            # 全局配置
│   │   ├── main-logic.js        # 主业务逻辑
│   │   └── content-script.js    # Content Script 入口
│   │
│   ├── handlers/                 # 处理器模块
│   │   ├── interceptor.js       # HTTP 请求拦截器
│   │   ├── response-handlers.js # 响应数据处理器
│   │   └── dom-handler.js       # DOM 元素处理器
│   │
│   ├── utils/                    # 工具模块
│   │   ├── utils.js             # 通用工具函数
│   │   ├── storage.js           # 本地存储管理
│   │   └── data-processor.js    # 数据处理工具
│   │
│   └── services/                 # 服务模块
│       └── mock-loader.js       # Mock 数据加载服务
│
├── data/                         # 数据文件
│   └── mock-data.json           # Mock 数据
│
├── lib/                          # 第三方库
│   └── ajaxhook.min.js          # Ajax Hook 库
│
├── icons/                        # 图标资源
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
│
├── dist/                         # 构建输出目录（自动生成）
│   ├── js/                      # 编译后的 JS 文件
│   ├── data/                    # 数据文件
│   ├── icons/                   # 图标文件
│   ├── lib/                     # 第三方库
│   └── manifest.json            # 扩展配置
│
├── manifest.json                 # Chrome 扩展配置文件
├── webpack.config.js            # Webpack 构建配置
├── package.json                 # 项目依赖配置
├── build-zip.js                 # ZIP 打包脚本
├── .babelrc                     # Babel 配置
├── .gitignore                   # Git 忽略配置
│
└── 文档/
    ├── QUICK_START.md           # 快速开始指南
    ├── BUILD_GUIDE.md           # 构建指南
    ├── DEBUG_CHART.md           # 图表调试指南
    └── PROJECT_STRUCTURE.md     # 项目结构说明（本文件）
```

## 📦 模块说明

### Core（核心模块）

**config.js**
- 全局配置管理
- API 配置
- URL 匹配规则
- 调试开关
- 控制台过滤配置

**main-logic.js**
- 主业务逻辑
- 初始化流程
- 全局 API 暴露

**content-script.js**
- Content Script 入口
- 模块加载验证
- 错误过滤初始化

### Handlers（处理器模块）

**interceptor.js**
- HTTP 请求拦截
- 响应数据修改
- Mock/API 数据获取
- 时间参数提取

**response-handlers.js**
- 概览页面响应处理
- 广告系列列表处理
- 广告组列表处理
- 年龄/性别/设备服务处理
- 账单和交易处理

**dom-handler.js**
- DOM 元素监听和修改
- 统计数值更新
- 日期选择器监听
- 只读按钮处理

### Utils（工具模块）

**utils.js**
- 通用工具函数
- 日期格式化
- 数据验证
- 辅助方法

**storage.js**
- LocalStorage 管理
- 数据缓存
- 过期时间处理

**data-processor.js**
- 数据格式转换
- JSON 解析/序列化
- 统计数据计算
- 图表数据处理

### Services（服务模块）

**mock-loader.js**
- Mock 数据加载
- 数据缓存管理
- 数据刷新
- 数据类型获取

## 🔄 数据流

```
1. 页面加载
   ↓
2. content-script.js 初始化
   ↓
3. config.js 加载配置
   ↓
4. mock-loader.js 加载 Mock 数据
   ↓
5. interceptor.js 拦截 HTTP 请求
   ↓
6. response-handlers.js 处理响应数据
   ↓
7. dom-handler.js 修改页面元素
   ↓
8. 用户看到修改后的数据
```

## 🎯 加载顺序

根据 manifest.json 中的配置，文件按以下顺序加载：

1. `lib/ajaxhook.min.js` - Ajax Hook 库
2. `src/core/config.js` - 配置
3. `src/utils/utils.js` - 工具函数
4. `src/utils/storage.js` - 存储管理
5. `src/services/mock-loader.js` - Mock 加载器
6. `src/utils/data-processor.js` - 数据处理器
7. `src/handlers/interceptor.js` - 请求拦截器
8. `src/handlers/response-handlers.js` - 响应处理器
9. `src/handlers/dom-handler.js` - DOM 处理器
10. `src/core/main-logic.js` - 主逻辑
11. `src/core/content-script.js` - 入口验证

## 📝 文件职责

### 单一职责原则

每个文件都有明确的职责：

- **config.js**: 只负责配置管理
- **interceptor.js**: 只负责请求拦截
- **response-handlers.js**: 只负责响应处理
- **dom-handler.js**: 只负责 DOM 操作
- **mock-loader.js**: 只负责数据加载
- **storage.js**: 只负责存储管理
- **data-processor.js**: 只负责数据处理

### 依赖关系

```
content-script.js
    ↓
main-logic.js
    ↓
dom-handler.js → config.js
    ↓            ↓
interceptor.js → mock-loader.js → storage.js
    ↓                ↓
response-handlers.js → data-processor.js → utils.js
```

## 🔧 修改指南

### 添加新功能

1. **添加新的 URL 拦截**
   - 在 `src/core/config.js` 的 `TARGET_URLS` 中添加
   - 在 `src/handlers/interceptor.js` 中添加处理逻辑

2. **添加新的响应处理**
   - 在 `src/handlers/response-handlers.js` 中添加处理方法

3. **添加新的 DOM 修改**
   - 在 `src/handlers/dom-handler.js` 中添加处理逻辑

4. **添加新的工具函数**
   - 在 `src/utils/utils.js` 中添加

5. **添加新的数据处理**
   - 在 `src/utils/data-processor.js` 中添加

### 修改 Mock 数据

直接编辑 `data/mock-data.json` 文件

### 修改配置

编辑 `src/core/config.js` 文件

## 🚀 构建流程

```
源代码 (src/)
    ↓
Webpack 编译
    ↓
Babel 转译
    ↓
Terser 压缩混淆
    ↓
输出到 dist/
    ↓
打包成 ZIP
```

## 📊 文件大小参考

| 文件 | 原始大小 | 压缩后大小 |
|------|---------|-----------|
| config.js | ~3KB | ~1KB |
| interceptor.js | ~15KB | ~5KB |
| response-handlers.js | ~10KB | ~3KB |
| dom-handler.js | ~8KB | ~2KB |
| mock-loader.js | ~5KB | ~2KB |
| 总计 | ~50KB | ~15KB |

## 🎨 代码风格

- 使用 ES6+ 语法
- 类和方法使用 JSDoc 注释
- 统一的错误处理
- 统一的日志输出格式
- 配置驱动的设计

## 📚 相关文档

- [快速开始](./QUICK_START.md)
- [构建指南](./BUILD_GUIDE.md)
- [图表调试](./DEBUG_CHART.md)
