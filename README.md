# Monitoring Dashboard（前端演示工程）

> 一个现代化的监控看板前端基线：仪表盘总览、遥测趋势、告警闭环、安全中心与用户管理。  
> 目标是 **可运行、可演进、可复用**：用领域化状态管理与轻量基础设施层，替代“巨型 Store + 重依赖工具链”。

---

## ✨ 关键特性

- **模块化信息架构**：Dashboard / Telemetry / Alerts / Security / Logs / User Management 分区清晰
- **告警闭环体验**：当前告警、历史筛选、导出、状态复盘（演示数据源）
- **统一交互反馈**：Toast/Confirm 统一走 `ui` store，避免分散的 notify 工具
- **领域化 Store 架构**：按业务域拆分 Pinia store，降低耦合、便于扩展
- **轻量依赖哲学**：能用原生 Web API 就不引入库（fetch、Intl、下载、localStorage）
- **商业化视觉基线**：Tailwind + CSS 变量设计系统 + 玻璃拟态卡片与统一交互密度

---

## 🧭 功能模块

- **仪表盘（Dashboard）**：关键指标总览与摘要卡片
- **系统资源（Telemetry）**：CPU / 内存 / 磁盘 / 网络 / 温度 / 进程（演示遥测）
- **系统警报（Alerts）**：当前 / 历史 / 设置 / 导出
- **安全中心（Security）**：威胁检测 / 合规审计 / 访问控制（演示视图）
- **日志中心（Logs）**：系统日志 / 安全日志 / 审计日志（演示视图）
- **用户管理（Users）**：用户 CRUD / 用户组 / 角色权限（演示数据）

---

## 🚀 快速开始

### 环境要求

- Node.js：建议使用 **LTS**
- 包管理器：npm（仓库包含 `package-lock.json`）

### 启动开发环境

```bash
npm install
npm run dev
```

### 构建与预览

```bash
npm run build
npm run preview
```

---

## 🔐 默认账号（演示）

- 用户名：`admin`
- 密码：`password`

---

## 🧱 技术栈

- Vue 3 + Vite
- Pinia + Vue Router
- Chart.js（图表）
- Tailwind CSS + 自定义 CSS 变量设计系统
- 自研 SVG 图标组件：`src/components/base/AppIcon.vue`

---

## 🧩 架构亮点（你会在代码里看到什么）

### 1) 领域化 Store（拒绝巨型 Store）

`src/stores/` 按领域拆分：

- `auth`：登录态、token、水合与登出
- `theme`：主题与持久化
- `tabs`：标签页/导航态
- `alerts`：告警闭环与持久化
- `users`：用户 CRUD、导出与持久化
- `telemetry`：遥测采样与进程管理（演示）
- `ui`：toast/confirm 等交互能力

### 2) 基础设施层 utils（极致减少重复代码）

- `src/utils/http.js`：Fetch client（超时/解析/错误结构）
- `src/utils/storage.js`：安全 localStorage（SSR 兼容、容错）
- `src/utils/datetime.js`：基于 Intl 的时间格式化（减少日期工具依赖）
- `src/utils/download.js`：原生下载封装（替代 file-saver 类库）
- `src/utils/csv.js`：CSV 构建/转义/下载（统一导出能力）
- `src/utils/filename.js`：文件名日期戳/时间戳生成（导出命名统一）

### 3) 可复用的交互与轮询能力

- `src/composables/usePolling.js`：统一轮询/计时器封装，避免组件内重复 `setInterval/clearInterval`

---

## 📁 目录结构（摘要）

```text
src/
  api/          # 服务层（演示数据源 / 未来接入真实 API 的抽象层）
  components/   # 业务组件与图表
    base/       # 基础组件（Button/Input/Icon 等）
  composables/  # 组合式逻辑
  layouts/      # 页面布局
  router/       # 路由与门禁
  stores/       # Pinia 领域状态
  utils/        # 基础设施工具集（无依赖优先）
  views/        # 路由级页面（支持懒加载）
  main.js       # 应用入口
```

---

## 🔭 演示数据与真实接入

当前工程以 **前端演示数据** 为主：

- 若接入真实 API：优先改造 `src/api/` 与对应 store 的数据源，再逐步替换 mock 数据。

---

## 🗺️ 未来进化蓝图（建议路线）

### vNext（体验增强 / 可观测性增强）

- 告警中心：更细的状态流转（ack / resolve）与批量操作、批量导出
- Logs：过滤条件、分页与“复制为查询语句/导出模板”增强
- 交互效率：快捷键（Command Palette 扩展）、保存筛选视图（Saved Views）
- 衡量指标（建议）：导出成功率、关键页面交互耗时（TTI/点击响应）、告警处理路径完成率

### vNext+1（真实数据源 / 实时化）

- 接入后端 API（REST/GraphQL）：统一错误码、鉴权（token 刷新/过期处理）、请求追踪（traceId）
- 引入 SSE/WebSocket：实时告警推送、在线状态、实时趋势更新（按需订阅）
- 数据一致性：请求缓存与失效（stale-while-revalidate）、失败重试与退避
- 衡量指标（建议）：端到端告警延迟（P95）、接口错误率、掉线恢复耗时

### vNext+2（工程化 / 企业化基线）

- 测试体系：Vitest + Testing Library + Playwright（覆盖登录/告警/导出/关键导航）
- CI/CD：构建检查、lint/类型检查、bundle size 回归阈值（预算制）
- 安全：依赖审计（SCA）、基础 CSP/安全响应头策略（若接入后端）
- 可扩展性：面向模块的配置化（可插拔数据源/告警规则/面板布局）
- 衡量指标（建议）：关键路径 E2E 覆盖率、构建成功率、体积预算（gzip）稳定性
