# Monitoring Dashboard

> 现代化前端监控看板（演示工程）：围绕可视化、告警闭环、安全中心与用户管理，提供可扩展的模块化架构与一致的 UI 体验。

---

## 1. 项目概述

### 目标与背景

- 提供一个“可运行、可演进”的监控看板前端基线，用于快速验证 UI 信息架构、状态管理拆分与交互体验。
- 通过 **领域化 Store + 轻量 utils 基础设施层** 降低耦合度，避免巨型 Store 与重复工具逻辑。

### 范围

- **范围内：** 页面导航、指标展示、告警闭环、审计与日志展示、用户与权限管理（演示数据源）。
- **范围外：** 后端持久化、真实权限鉴权、实时推送（WebSocket/SSE）、生产级多租户（可作为后续演进方向）。

---

## 2. 模块索引

| 模块名称 | 职责 | 状态 | 文档 |
|---------|------|------|------|
| App Shell | 路由、布局、导航与主题 | ✅稳定 | `modules/app-shell.md` |
| Auth | 登录态与鉴权门禁（演示） | ✅稳定 | `modules/auth.md` |
| Alerts | 告警闭环、历史、设置与导出 | ✅稳定 | `modules/alerts.md` |
| Users | 用户与用户组管理（演示） | ✅稳定 | `modules/users.md` |
| Telemetry | 系统资源/进程/日志等演示遥测 | ✅稳定 | `modules/telemetry.md` |
| Security | 威胁检测、合规与审计展示（演示） | ✅稳定 | `modules/security.md` |
| Charts | 图表封装与指标可视化 | ✅稳定 | `modules/charts.md` |
| Utils | HTTP/Storage/Datetime/Download 等基础设施 | ✅稳定 | `modules/utils.md` |
| UI Foundation | Design Tokens、基础组件与动效基线 | ✅稳定 | `modules/ui-foundation.md` |

---

## 3. 快速链接

- 技术约定：`../project.md`
- 架构设计：`arch.md`
- API 手册：`api.md`
- 数据模型：`data.md`
- 变更历史：`../history/index.md`
