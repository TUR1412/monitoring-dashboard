# 任务清单: 终极压缩与自洽迭代

目录: `helloagents/plan/202512242246_ultimate-compression/`

---

## 1. 冗余去重（工具化）
- [√] 1.1 新增 `src/utils/csv.js`（escape/build/export），并替换全项目 CSV 导出重复实现
- [√] 1.2 统一时间戳实现：移除 `src/utils/logs.js` 中重复的 datetime 逻辑，改为复用 `src/utils/datetime.js`
- [√] 1.3 新增 `src/composables/usePolling.js`，替换项目内 `setInterval/clearInterval` 的重复模式
- [√] 1.4 新增 `src/components/charts/ChartCard.vue`，统一图表容器结构并迁移主要图表组件

## 2. 构建体积极限优化
- [√] 2.1 优化 `src/components/charts/ChartComponent.vue`：Chart.js 按需注册（替代 registerables 全量注册）
- [√] 2.2 微调 `vite.config.js`：更激进的压缩与 tree-shaking（drop console + Vue flag）

## 3. README 蓝图增强
- [√] 3.1 更新 `README.md` 的“未来进化蓝图”板块：明确未来三个版本的方向、交付与衡量指标

## 4. 安全检查
- [√] 4.1 扫描敏感信息与潜在注入点（下载/导出/动态 HTML）

## 5. 验证与发布
- [√] 5.1 运行 `npm run build` 并修复阻断问题
- [ ] 5.2 `git commit` 并推送到远程仓库

> 备注: 本次构建验证通过，同时通过 Chart.js 按需注册与更激进压缩策略压缩了 vendor-charts 产物体积。
