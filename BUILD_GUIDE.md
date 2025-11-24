# 构建指南

## 项目结构

```
excellent-master-extension/
├── src/                    # 源代码目录
│   ├── config.js          # 配置文件
│   ├── utils.js           # 工具函数
│   ├── storage.js         # 存储管理
│   ├── mock-loader.js     # Mock 数据加载器
│   ├── data-processor.js  # 数据处理器
│   ├── interceptor.js     # 请求拦截器
│   ├── response-handlers.js # 响应处理器
│   ├── dom-handler.js     # DOM 处理器
│   ├── main-logic.js      # 主逻辑
│   └── content-script.js  # Content Script 入口
├── data/                   # 数据文件
│   └── mock-data.json     # Mock 数据
├── icons/                  # 图标文件
├── lib/                    # 第三方库
│   └── ajaxhook.min.js    # Ajax Hook 库
├── dist/                   # 构建输出目录（自动生成）
├── manifest.json          # Chrome 扩展配置
├── webpack.config.js      # Webpack 配置
├── package.json           # 项目配置
└── build-zip.js           # 打包脚本
```

## 安装依赖

```bash
npm install
```

## 开发模式

开发模式会监听文件变化，自动重新构建：

```bash
npm run dev
```

特点：
- 保留 source map，方便调试
- 不压缩代码
- 保留 console.log
- 自动监听文件变化

## 生产构建

生产构建会压缩和混淆代码：

```bash
npm run build
```

特点：
- 代码压缩和混淆
- 移除 console.log（保留 console.error）
- 移除注释
- 变量名混淆
- 无 source map

## 打包成 ZIP

构建并打包成 Chrome 扩展 ZIP 文件：

```bash
npm run build:zip
```

这会：
1. 执行生产构建
2. 将 dist 目录打包成 `excellent-master-extension.zip`
3. 可以直接上传到 Chrome Web Store

## 清理构建文件

```bash
npm run clean
```

## 构建输出

构建后的文件结构：

```
dist/
├── js/                     # 编译后的 JavaScript 文件
│   ├── config.js          # 已压缩和混淆
│   ├── utils.js
│   ├── storage.js
│   ├── mock-loader.js
│   ├── data-processor.js
│   ├── interceptor.js
│   ├── response-handlers.js
│   ├── dom-handler.js
│   ├── main-logic.js
│   └── content-script.js
├── data/                   # 数据文件
│   └── mock-data.json
├── icons/                  # 图标文件
├── lib/                    # 第三方库
│   └── ajaxhook.min.js
└── manifest.json          # 更新后的 manifest
```

## 代码混淆配置

在 `webpack.config.js` 中可以调整混淆级别：

```javascript
terserOptions: {
  compress: {
    drop_console: false,      // 是否移除 console
    drop_debugger: true,      // 移除 debugger
    pure_funcs: ['console.log'] // 移除特定函数
  },
  mangle: {
    toplevel: true,           // 混淆顶级作用域
    safari10: true            // Safari 10 兼容
  }
}
```

## 加载扩展

### 开发模式
1. 运行 `npm run dev`
2. 打开 Chrome 扩展管理页面 `chrome://extensions/`
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `dist` 目录

### 生产模式
1. 运行 `npm run build:zip`
2. 将生成的 `excellent-master-extension.zip` 上传到 Chrome Web Store
3. 或者解压后加载到 Chrome

## 注意事项

1. **首次构建**：首次运行需要先安装依赖 `npm install`
2. **文件监听**：开发模式下修改源文件会自动重新构建
3. **调试**：开发模式保留了 source map，可以在浏览器中调试原始代码
4. **代码保护**：生产构建会混淆代码，但不是完全加密，仍可被反混淆
5. **性能**：混淆后的代码体积更小，加载速度更快

## 常见问题

### Q: 构建后扩展无法加载？
A: 检查 `dist/manifest.json` 中的路径是否正确

### Q: 如何查看混淆后的代码？
A: 打开 `dist/js/` 目录查看编译后的文件

### Q: 如何禁用代码混淆？
A: 在 `webpack.config.js` 中设置 `minimize: false`

### Q: 如何保留某些变量名不被混淆？
A: 在 terserOptions.mangle 中添加 `reserved: ['变量名']`

## 进阶配置

### 添加 TypeScript 支持
1. 安装依赖：`npm install -D typescript ts-loader`
2. 创建 `tsconfig.json`
3. 修改 webpack.config.js 添加 ts-loader

### 添加代码检查
1. 安装 ESLint：`npm install -D eslint`
2. 创建 `.eslintrc.js`
3. 在 package.json 添加 lint 脚本

### 环境变量
使用 webpack.DefinePlugin 注入环境变量：
```javascript
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
})
```
