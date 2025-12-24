# Utils

## 目的
提供“可复用、低依赖”的基础设施能力，减少重复代码与第三方依赖。

## 模块概述
- **职责:** HTTP、Storage、Datetime、Download 等
- **状态:** ✅稳定
- **最后更新:** 2025-12-24

## 规范

### 需求: 统一 HTTP 错误结构
**模块:** Utils  
调用 API 需要统一错误结构，避免 UI 层到处写重复 try/catch 解析。

#### 场景: 请求失败
- 预期结果：返回一致的错误对象（status/message/details），UI 可直接 toast

## 依赖
- `src/utils/http.js`
- `src/utils/storage.js`
- `src/utils/datetime.js`
- `src/utils/download.js`
- `src/utils/csv.js`
- `src/utils/filename.js`
