# 数据接入（API）

## 概述

当前工程以 **前端演示数据源** 为主：核心数据由 Pinia store 内置生成，并通过 `safeStorage` 持久化。
为保持包体与复杂度最小化，仓库当前 **不内置服务层**（未保留 `src/api/*`）。

如需接入真实后端 API，建议新增服务层（例如 `src/services/` 或自行恢复 `src/api/`）：

- Store 继续作为“领域状态 + 行为”的唯一入口
- 服务层只负责请求与数据适配（DTO/字段归一化/错误码映射）
- UI 只消费 Store 的状态与动作，避免组件内散落 `fetch/try/catch`

---

## 认证方式（演示）

- 通过 `auth` store 维护 token/登录态
- 路由守卫根据登录态决定是否允许访问受保护页面

> 注意：当前未实现生产级权限鉴权与 token 刷新策略。

---

## 建议接口形状（示例）

### Alerts

#### 获取告警列表
- `GET /api/alerts`
- 返回：告警数组（建议字段：`id/level/title/message/timestamp/source/acknowledged/muted/archived`）

#### 更新告警状态
- `PATCH /api/alerts/:id`
- Body：`{ acknowledged?: boolean, muted?: boolean, archived?: boolean }`

#### 导出告警
- `GET /api/alerts/export?format=csv`
- 建议由后端返回文件流；前端使用 `src/utils/download.js` 触发下载

---

## 错误处理约定

- 用户可感知错误：统一走 `src/stores/ui.js` 的 toast/confirm（避免 console-only）
- 存储与偏好：统一走 `src/utils/storage.js`（JSON 容错、SSR 兼容）
