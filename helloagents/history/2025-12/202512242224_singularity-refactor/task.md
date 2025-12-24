# 任务清单: Singularity Refactor（监控看板演示工程）

目录: `helloagents/plan/202512242224_singularity-refactor/`

---

## 1. 状态管理拆分（Pinia）
- [√] 1.1 移除巨型 Store，并按领域拆分 `src/stores/*`（auth/theme/tabs/users/alerts/telemetry/ui）
- [√] 1.2 统一交互反馈：toast/confirm 走 `src/stores/ui.js`，替代散落通知工具

## 2. Infra utils（依赖减重）
- [√] 2.1 新增 `src/utils/http.js`：Fetch client（统一超时/错误结构/响应解析）
- [√] 2.2 新增 `src/utils/storage.js`：安全 LocalStorage（SSR 兼容、JSON 容错）
- [√] 2.3 新增 `src/utils/datetime.js`：Intl 时间格式化（替代 date-fns 类库）
- [√] 2.4 新增 `src/utils/download.js`：原生下载封装（替代 file-saver）

## 3. 路由与加载策略
- [√] 3.1 更新 `src/router/index.js`：路由懒加载 + auth 门禁 + tabs 联动
- [√] 3.2 优化 `vite.config.js`：拆分 vendor chunk（vue/charts）

## 4. UI 图标体系（去 FontAwesome）
- [√] 4.1 新增 `src/components/base/AppIcon.vue` 并覆盖关键图标用例
- [√] 4.2 全量替换 `<i class="fa*">` 使用点为 `<AppIcon />`
- [√] 4.3 移除 FontAwesome 依赖与入口 CSS 引入

## 5. 依赖一致性与构建验证
- [√] 5.1 同步 `package-lock.json`（执行 `npm install`）
- [√] 5.2 构建验证：执行 `npm run build`，确保产物可生成

## 6. 文档与 SSOT
- [√] 6.1 重写根 `README.md`（面向二次开发与演进说明）
- [√] 6.2 初始化并补齐 `helloagents/` 知识库（overview/arch/api/data/modules）

## 7. 安全检查
- [√] 7.1 全局扫描敏感信息与高风险依赖引用点（未发现硬编码密钥）

## 8. 发布与清理
- [√] 8.1 `git commit` 并推送到远程仓库（已完成）
- [?] 8.2 推送后销毁本地克隆目录（高风险操作，需再次确认删除路径）

> 备注: 本阶段已完成代码与文档变更，并通过构建验证；是否推送/是否删除本地目录属于不可逆操作，需要在最终确认后执行。
