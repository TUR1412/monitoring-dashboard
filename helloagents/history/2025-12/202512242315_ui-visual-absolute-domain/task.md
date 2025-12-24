# 任务清单: UI 视觉绝对领域迭代与全量细节审判

目录: `helloagents/plan/202512242315_ui-visual-absolute-domain/`

---

## 1. Pixel Perfect（排版与对齐审计）
- [√] 1.1 在 `src/style.css` 增加 spacing/typography token，并统一标题/正文/表格行高规则
- [√] 1.2 引入长文本截断与渐变遮罩工具类（mask + fallback）
- [√] 1.3 统一 focus-visible 与键盘导航样式（无障碍 + 视觉一致）

## 2. 动态触感美学（动效与缓动）
- [√] 2.1 在全局样式加入统一 easing/duration token（cubic-bezier）
- [√] 2.2 升级 BaseButton/BaseModal/Toast 的交互反馈（hover/press/enter）
- [√] 2.3 加入 `prefers-reduced-motion` 兼容，避免动效过载

## 3. 暗黑模式细节
- [√] 3.1 微调暗/亮主题下的对比度层级与背景噪点强度
- [√] 3.2 SVG 图标对齐与交互按钮图标的对齐细节修复

## 4. 地毯式低级错误扫描
- [√] 4.1 扫描并修复潜在 console warning（key/props）、失效 aria、非标准嵌套、拼写瑕疵

## 5. 验证与发布
- [√] 5.1 运行 `npm run build`（阻断验证）
- [√] 5.2 `git commit` 并推送到远程仓库
