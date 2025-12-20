# [MD-001] 任务看板
> **环境**: Windows 11 (pwsh -NoLogo -NoProfile -Command) | **框架**: Vue 3 + Vite | **档位**: 4档 (架构重构)
> **已激活矩阵**: [模块 A: 视觉矫正] + [模块 E: 幽灵防御] + [模块 F: 需求镜像]

## 1. 需求镜像 (Requirement Mirroring)
> **我的理解**: 对 `monitoring-dashboard` 进行原子级审查、修复、升级与扩展，重点完成世界级 UI 进化与 README 美化，最终推送并删除本地克隆。
> **不做什么**: 不启动任何后台服务；不占用端口；不修改 AGENTS.md 协议文件。

## 2. 进化知识库 (Evolutionary Knowledge - Ω)
- [!] Windows 环境必须使用 Standard Wrapper: `pwsh -NoLogo -NoProfile -Command '...'`
- [!] 仓库中存在缺失的日志组件路由目标（需补齐或调整路由）
- [!] UserManagement 角色统计与数据结构存在不一致（role 大小写、isActive 缺失）

## 3. 执行清单 (Execution)
- [x] 1. 结构审查与缺失组件修复（logs 相关）
- [x] 2. 主题与设计系统重塑（全局 tokens + 玻璃质感 + Bento 布局）
- [x] 3. 核心页面升级（Dashboard / Header / Sidebar / TabBar / Login / Logs 等）
- [x] 4. 命令面板与快捷导航能力注入（Ctrl + K）
- [x] 5. 图表渲染优化与主题自适配
- [x] 6. 报告中心 UI 重构与导出能力强化
- [x] 7. 表单控件与状态持久化升级（reports）
- [x] 8. README 一级美化与内容重写
- [x] 9. 自研通知系统与确认弹窗接入（去 Element Plus）
- [x] 10. 历史警报中心重构（过滤/分页/导出/详情）与依赖瘦身
- [x] 11. 资产体积优化（默认头像/Logo SVG 化）
- [x] 12. 有限构建验证（npm run build 或 node --check）
- [x] 13. FontAwesome 子集加载与字体体积压缩
- [ ] 14. 推送并按要求删除本地仓库（需最终确认）
