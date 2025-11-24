# 调试悬浮图表数据

## 如何找到悬浮图表的请求 URL

1. **打开浏览器控制台**
   - 按 F12 打开开发者工具
   - 切换到 Console（控制台）标签

2. **触发悬浮图表**
   - 将鼠标悬停在"点击次数"指标上
   - 等待悬浮图表显示

3. **查看控制台日志**
   - 在控制台中查找紫色的日志：`[拦截器] 检测到 Service URL:`
   - 记录下显示悬浮图表时出现的新 URL

4. **添加到配置**
   - 将找到的 URL 关键词添加到 `src/config.js` 的 `TARGET_URLS` 中
   - 例如：`TIME_SERIES: 'TimeSeriesService/Get'`

5. **添加处理器**
   - 在 `src/interceptor.js` 中添加对应的处理函数
   - 在 `handleResponse` 方法中添加 URL 匹配和处理逻辑

## 可能的 URL 关键词

悬浮图表可能使用以下服务之一：
- `TimeSeriesService`
- `ChartDataService`
- `MetricService`
- `OverviewService` (可能已经在处理)
- `StatsService`

## 示例：添加新的 URL 处理

### 1. 在 config.js 中添加：
```javascript
TARGET_URLS: {
  // ... 现有的 URL
  TIME_SERIES: 'TimeSeriesService/Get'
}
```

### 2. 在 interceptor.js 的 handleResponse 中添加：
```javascript
// 在 shouldProcess 判断中添加
url.includes(CONFIG.TARGET_URLS.TIME_SERIES) ||

// 在处理逻辑中添加
else if (url.includes(CONFIG.TARGET_URLS.TIME_SERIES)) {
  this.log('匹配到 Time Series URL，开始处理');
  this.handleTimeSeriesResponse(response);
}
```

### 3. 添加处理函数：
```javascript
/**
 * 处理时间序列响应
 */
handleTimeSeriesResponse(response) {
  try {
    const data = JSON.parse(response.response);
    const timeSeriesData = this.latestServerData?.accountCostChart || [];
    
    // 修改数据结构（根据实际响应格式调整）
    if (data && timeSeriesData.length > 0) {
      // 填充时间序列数据
      data.points = timeSeriesData.map(day => ({
        date: day.date,
        value: day.clicks
      }));
    }
    
    response.response = JSON.stringify(data);
    this.log('时间序列响应已处理');
  } catch (error) {
    this.error('处理时间序列响应失败:', error);
  }
}
```

## 注意事项

- 确保 `CONFIG.DEBUG` 设置为 `true` 才能看到调试日志
- 悬浮图表可能使用已有的 `OverviewService` 数据，不需要额外处理
- 如果找不到新的请求，说明数据已经在 Overview 响应中包含了
