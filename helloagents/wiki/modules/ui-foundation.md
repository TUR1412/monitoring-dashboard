# UI Foundation

## 目的
统一全站视觉基线与交互语言：Design Tokens、基础组件、动效与无障碍。

## 模块概述
- **职责:** 全局 tokens（spacing/typography/motion）、基础组件（BaseButton/BaseInput/BaseModal/AppIcon）、焦点可见性、长文本截断
- **状态:** ✅稳定
- **最后更新:** 2025-12-24

## 规范

### 需求: Design Tokens 一致性
**模块:** UI Foundation  
新增样式必须优先使用 `src/style.css` 中的 token（例如 `--space-*`、`--fs-*`、`--dur-*`、`--ease-*`），避免写死数值造成“像素漂移”与主题不一致。

### 需求: 动效与 Reduced Motion
**模块:** UI Foundation  
交互动效应统一采用 `--dur-*` 与 `--ease-*`，并在 `prefers-reduced-motion` 下自动降级，以避免动效过载影响可访问性与性能。

### 需求: 可访问性（A11y）
**模块:** UI Foundation  
可交互元素需具备清晰的 `:focus-visible` 样式；组件优先使用语义化标签，并在需要时补齐 ARIA（如 `role="tablist/tab"`、`aria-selected`、`aria-modal` 等）。

## 依赖
- `src/style.css`
- `src/components/base/*`
- `src/components/common/ToastStack.vue`
- `src/components/TabBar.vue`

