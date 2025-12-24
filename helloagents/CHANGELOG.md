# Changelog

本文件记录项目所有重要变更。
格式基于 Keep a Changelog，版本号遵循语义化版本（SemVer）。

## [Unreleased]

### 新增
- 领域化 Pinia Store：按 `auth/theme/tabs/users/alerts/telemetry/ui` 拆分，降低耦合度并提升可维护性。
- 基础设施工具集：`fetch` 客户端、下载、存储、时间格式化（逐步替代可被原生能力覆盖的第三方库）。
- 通用导出能力：`csv` 构建与下载、`filename` 时间戳命名工具，统一导出体验并减少重复实现。
- 轮询封装：`usePolling` 统一管理计时器生命周期，消除组件内重复的 `setInterval/clearInterval` 模式。
- 图表容器组件：`ChartCard` 统一图表标题与布局结构，降低图表组件重复代码。
- 图标体系：自研 `AppIcon`（内联 SVG），替代外部图标库并统一视觉输出。

### 变更
- 路由改为按页懒加载，减少首屏包体并提升导航响应。
- UI 交互反馈统一走 `ui` store（toast/confirm），统一体验与状态管理。
- Chart.js 改为按需注册（替代 `registerables` 全量注册），显著降低 `vendor-charts` 包体。
- Vite 构建压缩策略更激进（drop console/debugger、关闭生产 devtools），进一步压缩产物。

### 移除
- 移除 FontAwesome 等外部图标依赖，避免全量 CSS 引入带来的额外负担。
- 移除可被原生能力覆盖的依赖（以包体积与启动性能为导向）：如 axios/date-fns/file-saver/Element Plus 等。
- 删除未使用的图表辅助文件与过时组件，减少仓库冗余。
