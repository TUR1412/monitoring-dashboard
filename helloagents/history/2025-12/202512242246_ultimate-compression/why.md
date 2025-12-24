# 变更提案: 终极压缩与自洽迭代

## 需求背景

在完成一次大规模架构升级后，项目仍存在进一步的“可维护性压缩”与“构建体积压缩”空间：

1. **重复逻辑残留**：CSV 导出、时间戳处理、轮询计时器、图表容器结构等逻辑仍分散在多个组件中。
2. **构建体积仍可优化**：Chart.js 仍可能因“全量注册”导致额外代码进入 bundle；Vite/rollup/esbuild 的压缩与 tree-shaking 策略可更激进。
3. **文档蓝图需更具体**：README 需要给出更明确的 3 个版本演进路线，便于后续迭代规划。

本次迭代目标是：在不牺牲可读性与稳定性的前提下，最大化消除“结构性重复”，并进一步压缩生产构建产物。

## 变更内容

1. **冗余去重与工具化**
   - 抽象 CSV 导出与文件名时间戳生成
   - 抽象轮询/计时器逻辑（usePolling）
   - 统一时间戳解析与格式化（移除重复实现）
   - 抽象图表容器结构（ChartCard）
2. **构建体积极限优化**
   - Chart.js 按需注册（替代 registerables 全量注册）
   - Vite 构建策略微调（drop console、Vue 编译期 flag、tree-shaking 约束）
3. **README 蓝图增强**
   - 补强“未来进化蓝图”板块：未来三个版本明确目标、交付与衡量标准

## 影响范围

- `src/components/charts/*`
- `src/components/security/ThreatDetection.vue`
- `src/utils/*`
- `src/composables/*`
- `vite.config.js`
- `README.md`
- `helloagents/wiki/*`（同步事实）

## 风险评估

- **风险:** 过度抽象导致可读性下降  
  **缓解:** 只抽象跨文件重复且边界清晰的逻辑（CSV/轮询/时间/图表容器）。
- **风险:** 更激进的 tree-shaking 引入运行时缺失（Chart.js 未注册组件）  
  **缓解:** 全局搜索 Chart 类型并按需注册；以 `npm run build` 作为阻断验证。

