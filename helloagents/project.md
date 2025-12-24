# 项目技术约定

本项目为 Vue 3 + Vite 的前端监控看板演示工程，强调 **可维护性、可读性与可扩展性**，并通过减少不必要依赖实现更轻的运行时负担。

---

## 技术栈

- **运行时:** Node.js（建议 LTS）
- **前端:** Vue 3、Vite
- **状态管理:** Pinia
- **路由:** Vue Router
- **样式:** Tailwind CSS + 自定义 CSS 变量设计系统
- **图表:** Chart.js（保留，因收益高且替代成本大）

---

## 工程约定

### 目录约定

- `src/views/`：路由级页面（支持懒加载）
- `src/components/`：页面级与领域组件
- `src/components/base/`：基础组件（按钮、输入、图标等）
- `src/stores/`：Pinia 领域 Store（按业务域拆分）
- `src/utils/`：无依赖工具集（存储、下载、时间、HTTP 等）
- `src/api/`：服务层（封装数据源；演示环境可为 mock）

### 命名与风格

- **组件命名:** PascalCase（Vue SFC）
- **Store 命名:** `useXxxStore`
- **工具函数:** 小而纯，优先无副作用；有副作用的工具要显式命名（如 `downloadText`）
- **导入路径:** 使用 `@` 指向 `src/`

---

## 错误与日志

- 统一使用 `src/utils/http.js` 的错误结构（尽量避免散落的 `fetch/try/catch` 重复）
- 用户可感知的错误统一通过 `src/stores/ui.js` 的 toast/confirm 输出（避免 console-only）

---

## 测试与发布

- **构建验证:** `npm run build`
- **本地预览:** `npm run preview`
- **开发启动:** `npm run dev`

> 说明：仓库当前以演示为主，尚未引入单元测试框架；如需要，可在后续迭代中补齐 Vitest + Testing Library 的测试基建。

