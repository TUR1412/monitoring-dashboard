# 技术设计: UI 视觉绝对领域迭代与全量细节审判

## 技术方案

### 1) Design Tokens（排版/间距/动效）

在 `src/style.css` 增加统一 token：

- Spacing：`--space-1..n`（以统一步进控制 padding/margin）
- Typography：`--font-*`、`--lh-*`（并采用 `clamp()` 适配主流分辨率）
- Motion：`--ease-*`、`--dur-*`（统一 cubic-bezier 曲线与时长）
- Focus：统一 `:focus-visible` 与键盘导航可见性

### 2) 交互触感（“物理引擎级”感知的可实现版本）

纯 CSS 实现可控且高性能的触感：

- Press：按下缩放 + 轻微高光扩散（伪元素）
- Modal：进入/离开使用统一 `cubic-bezier`，并加入轻微 overshoot
- List：TransitionGroup 统一进入/离开曲线，避免生硬移动
- Reduced Motion：在 `prefers-reduced-motion` 下禁用关键动画

### 3) 暗黑模式细节

- 统一背景噪点透明度、卡片边框强度、阴影层级
- 长文本：`mask-image` 的渐变遮罩（同时保留 ellipsis fallback）

### 4) 低级错误扫描

- 静态扫描：无效 aria、缺失 label、非语义 HTML、潜在 Vue warning（key/props）
- 阻断验证：`npm run build`

## 验证

- `npm run build` 必须通过
- 静态扫描（rg）无关键 warning 模式

