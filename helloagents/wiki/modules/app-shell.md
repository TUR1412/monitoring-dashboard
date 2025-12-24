# App Shell

## 目的
统一管理路由、布局、导航与主题切换，确保全局体验一致。

## 模块概述
- **职责:** 路由懒加载、登录门禁、标签页导航、基础布局（Header/Sidebar/TabBar）
- **状态:** ✅稳定
- **最后更新:** 2025-12-24

## 规范

### 需求: 路由与门禁
**模块:** App Shell  
页面路由按需加载，并通过 auth store 控制访问边界。

#### 场景: 未登录访问受保护页面
- 预期结果：重定向到登录页

### 需求: 导航可访问性与一致交互
**模块:** App Shell  
Header/Sidebar/TabBar 等导航区域需保持键盘可达与一致的视觉反馈（`focus-visible`、长文本截断与动效基线）。

#### 场景: 键盘切换标签页
- 预期结果：TabBar 支持键盘聚焦与 Enter/Space 激活；Delete 可关闭标签；可见焦点样式一致

## 依赖
- `auth` / `tabs` / `theme` store
- `src/router/index.js`
 - `src/components/TabBar.vue`
