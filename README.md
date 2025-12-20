# 监控仪表盘 · Monitoring Dashboard

> 世界级运维与安全态势可视化前端：实时、清晰、可操作。

![Vite](https://img.shields.io/badge/Vite-6.x-22d3ee?style=flat-square&logo=vite&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3.x-42b883?style=flat-square&logo=vue.js&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-2.x-f59e0b?style=flat-square&logo=pinia&logoColor=white)

---

## 核心亮点

- **夸克级 UI 进化**：Aurora 玻璃质感 + Bento Grid 结构，信息密度与可读性同时提升
- **实时态势总览**：健康评分、资源峰值、关键流程与告警概览一屏掌控
- **日志中心重构**：系统 / 安全 / 审计多维日志视图，支持搜索过滤与导出
- **日志检索增强**：时间范围、排序、数量上限与 CSV/JSON 多格式导出
- **警报指挥台**：批量确认/静音/归档、状态筛选与导出能力一体化
- **警报记忆**：筛选条件自动保存，重载后保持工作上下文
- **系统警报洞察**：严重度分布、筛选排序与摘要导出可视化
- **安全中心概览**：威胁/审计/合规评分一屏联动
- **命令面板**：快捷导航与一键动作（Ctrl + K），高频操作无需多级菜单
- **报告中心升级**：报告生成 / 下载 / JSON & CSV 导出一站式完成
- **主题与偏好持久化**：主题、标签、用户数据自动持久化，刷新不丢失
- **动效与可访问性**：渐入式层级动效 + WCAG 友好对比度

---

## 设计语言

- **色彩**：深海蓝 + 青蓝渐变 + 玫瑰警报色
- **布局**：Bento 网格 + 顶层玻璃面板
- **字体**：Space Grotesk（标题）+ Manrope（正文）
- **动效**：柔和层次过渡、状态徽章高亮、渐进式信息曝光

---

## 快速开始

```bash
npm install
npm run dev
```

构建产物：

```bash
npm run build
npm run preview
```

---

## 目录结构

```text
src/
  assets/            # 图标与静态资产
  components/        # 复用组件
  layouts/           # 布局框架
  router/            # 路由配置
  stores/            # Pinia 状态
  utils/             # 工具函数
  views/             # 页面视图
  style.css          # 全局设计系统
```

---

## 功能矩阵

| 模块 | 说明 |
| --- | --- |
| 监控总览 | 核心 KPI、趋势与异常一屏可视化 |
| 系统资源 | CPU / 内存 / 磁盘 / 网络 / GPU / 温度 |
| 系统警报 | 活动警报、历史记录与策略配置 |
| 日志中心 | 系统 / 安全 / 审计，多维检索与导出 |
| 用户管理 | 角色权限、用户状态、分组与操作审计 |
| 安全中心 | 威胁检测、访问控制与合规审核 |
| 数据分析 | 流量分析、性能诊断与报告生成 |

---

## 快捷键

| 操作 | 快捷键 |
| --- | --- |
| 打开命令面板 | Ctrl + K |
| 关闭命令面板 | Esc |

---

## 数据持久化策略

- 主题、标签、用户数据均写入 localStorage
- 关键交互状态刷新后可恢复

---

## 界面预览

> 建议在此处放置高分辨率截图或演示 GIF，以展示 Aurora 玻璃质感与 Bento 布局。

---

## 进阶脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动本地开发 |
| `npm run build` | 构建生产包 |
| `npm run preview` | 本地预览 |

---

## 后续可扩展方向

- 观测数据接入（Prometheus / Loki / OpenTelemetry）
- 风险预测模型与异常检测
- 多租户支持与细粒度权限策略
- 多语言与国际化

---

## License

MIT
