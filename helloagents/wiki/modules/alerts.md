# Alerts

## 目的
提供告警闭环体验：产生 → 展示 → 筛选 → 导出 → 复盘。

## 模块概述
- **职责:** 当前告警、告警历史、告警设置、导出与状态更新
- **状态:** ✅稳定
- **最后更新:** 2025-12-25

## 规范

### 需求: 告警历史筛选与导出
**模块:** Alerts  
用户可以筛选并导出告警记录，便于复盘与留存。

#### 场景: 导出筛选结果
- 预期结果：导出文件可下载，字段含时间/类型/严重程度/状态/描述

## API接口
- 参考 `helloagents/wiki/api.md`

## 依赖
- `src/stores/alerts.js`
- `src/stores/runtime.js`
- `src/utils/download.js`
- `src/utils/datetime.js`

