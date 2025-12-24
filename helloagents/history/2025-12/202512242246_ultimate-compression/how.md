# 技术设计: 终极压缩与自洽迭代

## 技术方案

### 1) 去重抽象策略

- **优先级 A（高收益/低风险）**
  - CSV 导出（escape/build/export）
  - 轮询计时器（setInterval/clearInterval 生命周期）
  - 时间戳解析/格式化（datetime SSOT）
- **优先级 B（中收益/中风险）**
  - 图表容器结构统一（ChartCard）
  - 多处重复的“文件名时间戳”生成

### 2) Chart.js 按需注册（Tree-shaking）

将 `Chart.register(...registerables)` 替换为：

- Controllers：Line/Bar/Pie/Doughnut
- Elements：LineElement/PointElement/BarElement/ArcElement
- Scales：CategoryScale/LinearScale
- Plugins：Tooltip/Legend

并同步收窄 `ChartComponent` 的 type 校验为实际使用集合。

### 3) Vite 构建微调（更激进的体积压缩）

- `esbuild.drop = ['console', 'debugger']`
- `define.__VUE_PROD_DEVTOOLS__ = false`，`define.__VUE_OPTIONS_API__ = true`（保持兼容但减少 devtools）
- `rollupOptions.treeshake`：启用更激进选项（谨慎设置 side effects）

## 测试与验证

- `npm run build`（阻断性验证）
- 关键页面手动冒烟（登录/告警历史导出/用户导出/图表渲染）

