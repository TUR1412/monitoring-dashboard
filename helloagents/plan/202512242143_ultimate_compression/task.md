# 任务清单: 终极压缩与自洽迭代

目录: `helloagents/plan/202512242143_ultimate_compression/`

---

## 1. JS 去重抽象
- [ ] 1.1 在 `assets/app.js` 中提取通用工具函数（DOM 查询/节流/可见性切换/mailto 构造）
- [ ] 1.2 收敛重复逻辑调用点，确保行为一致且更易维护

## 2. CSS 去重合并
- [ ] 2.1 深度扫描 `assets/styles.css` 中重复 selector，合并为单处定义
- [ ] 2.2 删除冗余覆盖段落，保持最终视觉效果与暗色主题一致

## 3. Vite 极限构建配置
- [ ] 3.1 新增 `package.json`（仅 devDependencies）与 `vite.config.*`
- [ ] 3.2 提供 `npm run build` 输出 `dist/` 的极限压缩路径（terser + treeshake）

## 4. README 未来进化蓝图
- [ ] 4.1 在 `README.md` 新增“未来进化蓝图”章节（未来 3 个版本路线）
- [ ] 4.2 更新构建/部署说明，明确“零依赖运行”与“可选构建”两条路径

## 5. 安全检查
- [ ] 5.1 执行安全检查（敏感信息、第三方依赖、潜在注入点、CSP自洽）

## 6. 验证与发布
- [ ] 6.1 运行静态扫描与语法校验（JS/JSON/CSS变量）
- [ ] 6.2 推送到远程仓库

