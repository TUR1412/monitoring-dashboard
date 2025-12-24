# 数据模型

## 概述

数据模型以“前端演示与状态管理”为目标，重点在结构清晰与可扩展性，而非数据库约束。

---

## 核心实体

### Alert（告警）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string/number | 唯一标识 |
| type | string | 告警类型 |
| severity | string | 严重程度（如 low/medium/high/critical） |
| status | string | 状态（如 open/acknowledged/resolved） |
| timestamp | string | ISO 时间戳 |
| description | string | 描述 |

### User（用户）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string/number | 唯一标识 |
| username | string | 用户名 |
| role | string | 角色 |
| status | string | 状态 |

### Telemetry（遥测）

| 字段 | 类型 | 说明 |
|------|------|------|
| cpuUsage | Array | CPU 采样序列（time, usage） |
| memoryUsageHistory | Array | 内存采样序列（time, value） |
| processes | Array | 进程列表（pid, name, cpu, memory, status） |

