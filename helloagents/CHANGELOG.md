# Changelog

本文件记录项目所有重要变更。
格式基于 Keep a Changelog，版本号遵循语义化版本（SemVer）。

## [Unreleased]

## [1.3.0] - 2025-12-25

### 新增
- 引入全局运行时编排 `runtime` store：统一实时刷新开关/间隔/最后刷新时间，并由 Header 提供可视化控制。
- 新增 `src/utils/sleep.js`：演示可控延迟（默认 0ms），支持通过 `VITE_DEMO_LATENCY_MS` 在本地模拟 loading。
- 遥测数据 `telemetry` 支持动态刷新（滑窗更新 CPU/内存/网络/温度/I/O/日志/进程等），增强“实时看板”体验。

### 变更
- 全站偏好/筛选/缓存统一走 `safeStorage`（替代散落的 localStorage + JSON.parse），提升容错与一致性。
- 用户可感知错误统一通过 UI toast 呈现，移除多处 console-only 错误处理。
- 移除多处重复轮询，关键数据刷新由 `runtime` store 统一调度，降低运行时开销。

### 移除
- 删除未被引用的 service/http 死代码（`src/api/alertService.js`、`src/utils/http.js`），保持工程极简与真实一致。

## [1.2.1] - 2025-12-24

### 变更
- 视觉基线：引入 spacing/typography/motion token（`src/style.css`），统一全站行高、缓动曲线与过渡时长。
- 交互触感：升级 `BaseButton`/`BaseModal`/`ToastStack` 的 hover/press/enter 反馈，并兼容 `prefers-reduced-motion`。
- 暗黑模式细节：背景噪点与光晕强度按 light/dark 分层，提升对比度一致性。
- 无障碍：TabBar 支持键盘导航（`role=tablist/tab`、`aria-selected`、Delete 关闭），全站 `:focus-visible` 统一。

### 修复
- 清理 localStorage 读写的 console warning：统一改为 `safeStorage` 的容错读写。
- 修复 `BaseButton` 缺失 `ghost` 变体导致的 prop validator warning。

## [1.2.0] - 2025-12-24

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
