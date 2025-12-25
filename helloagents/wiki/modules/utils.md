# Utils

## 目的
提供“可复用、低依赖”的基础设施能力，减少重复代码与第三方依赖。

## 模块概述
- **职责:** Storage、Datetime、Download、Demo Sleep 等
- **状态:** ✅稳定
- **最后更新:** 2025-12-25

## 规范

### 需求: 统一存储与偏好读写
**模块:** Utils  
全站偏好/筛选/缓存统一使用 `safeStorage`，避免散落的 `localStorage.getItem/JSON.parse` 造成的崩溃风险与重复代码。

#### 场景: JSON 损坏或 SSR 环境
- 预期结果：读取容错（fallback）、不会抛异常；SSR 场景下返回 fallback

### 需求: 可控演示延迟（默认 0ms）
**模块:** Utils  
对演示型异步操作提供统一的延迟入口：默认不引入任何人为延迟；需要展示 loading/skeleton 时可通过环境变量开启。

## 依赖
- `src/utils/storage.js`
- `src/utils/datetime.js`
- `src/utils/download.js`
- `src/utils/csv.js`
- `src/utils/filename.js`
- `src/utils/sleep.js`
