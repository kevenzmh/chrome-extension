# 贡献指南

感谢你考虑为 Excellent Master 做出贡献！

## 如何贡献

### 报告 Bug

如果你发现了 Bug，请创建一个 Issue 并包含以下信息：

1. **Bug 描述** - 清晰简洁地描述问题
2. **复现步骤** - 详细的复现步骤
3. **期望行为** - 你期望发生什么
4. **实际行为** - 实际发生了什么
5. **环境信息** - Chrome 版本、操作系统等
6. **截图** - 如果适用，添加截图

### 提出新功能

如果你有新功能的想法：

1. 先检查 Issues 中是否已有类似建议
2. 创建一个 Feature Request Issue
3. 详细描述功能和使用场景
4. 说明为什么这个功能有用

### 提交代码

#### 开发流程

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上 Fork 仓库
   ```

2. **克隆到本地**
   ```bash
   git clone https://github.com/your-username/excellent-master-extension.git
   cd excellent-master-extension
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

5. **开发和测试**
   ```bash
   npm run dev
   # 在 Chrome 中加载扩展测试
   ```

6. **提交代码**
   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   # 或
   git commit -m "fix: 修复某个问题"
   ```

7. **推送到 GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **创建 Pull Request**
   - 在 GitHub 上创建 PR
   - 填写 PR 模板
   - 等待代码审查

#### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更新
- `style:` - 代码格式（不影响代码运行）
- `refactor:` - 重构（既不是新增功能，也不是修复 Bug）
- `perf:` - 性能优化
- `test:` - 添加测试
- `chore:` - 构建过程或辅助工具的变动

示例：
```
feat: 添加设备数据拦截功能
fix: 修复图表数据不更新的问题
docs: 更新 README 中的安装说明
```

#### 代码规范

1. **JavaScript 风格**
   - 使用 ES6+ 语法
   - 使用 2 空格缩进
   - 使用单引号
   - 添加必要的注释

2. **命名规范**
   - 类名使用 PascalCase：`RequestInterceptor`
   - 方法名使用 camelCase：`handleResponse`
   - 常量使用 UPPER_CASE：`CONFIG`
   - 文件名使用 kebab-case：`dom-handler.js`

3. **注释规范**
   - 类和方法使用 JSDoc 注释
   - 复杂逻辑添加行内注释
   - 注释要清晰、简洁

4. **文件组织**
   - 核心模块放在 `src/core/`
   - 处理器放在 `src/handlers/`
   - 工具函数放在 `src/utils/`
   - 服务放在 `src/services/`

#### 测试

在提交 PR 前，请确保：

1. ✅ 代码能正常构建：`npm run build`
2. ✅ 扩展能正常加载
3. ✅ 功能按预期工作
4. ✅ 没有控制台错误
5. ✅ 代码符合规范

### Pull Request 流程

1. **创建 PR**
   - 提供清晰的标题和描述
   - 关联相关的 Issue
   - 添加截图（如果适用）

2. **代码审查**
   - 等待维护者审查
   - 根据反馈修改代码
   - 保持 PR 更新

3. **合并**
   - 审查通过后会被合并
   - 你的贡献会被记录在 CHANGELOG 中

## 开发指南

### 项目结构

```
src/
├── core/          # 核心模块
├── handlers/      # 处理器
├── utils/         # 工具函数
└── services/      # 服务
```

### 添加新功能

1. **添加新的 URL 拦截**
   - 在 `src/core/config.js` 添加 URL
   - 在 `src/handlers/interceptor.js` 添加处理逻辑

2. **添加新的响应处理**
   - 在 `src/handlers/response-handlers.js` 添加方法

3. **添加新的 DOM 修改**
   - 在 `src/handlers/dom-handler.js` 添加逻辑

### 调试技巧

1. **启用调试模式**
   ```javascript
   // src/core/config.js
   DEBUG: true
   ```

2. **查看拦截的请求**
   - 打开控制台
   - 查看 `[RequestInterceptor]` 日志

3. **查看 DOM 修改**
   - 查看 `[DOMHandler]` 日志

## 行为准则

### 我们的承诺

为了营造一个开放和友好的环境，我们承诺：

- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 不可接受的行为

- 使用性化的语言或图像
- 人身攻击或侮辱性评论
- 公开或私下骚扰
- 未经许可发布他人的私人信息
- 其他不道德或不专业的行为

## 问题？

如果你有任何问题，可以：

1. 查看 [文档](./README.md)
2. 搜索 [Issues](https://github.com/yourusername/excellent-master-extension/issues)
3. 创建新的 Issue

## 感谢

感谢所有为这个项目做出贡献的人！

---

再次感谢你的贡献！🎉
