// src/utils/storage.js
// 提供对 LocalStorage 的安全访问封装：SSR 兼容、JSON 容错、异常保护。

const canUseStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

const tryParseJson = (raw) => {
  if (raw === null || raw === undefined) return { ok: false }
  try {
    return { ok: true, value: JSON.parse(raw) }
  } catch (_error) {
    return { ok: false }
  }
}

export const safeStorage = {
  get(key, fallback) {
    if (!canUseStorage) return fallback
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback

    // 兼容历史数据：优先 JSON.parse，失败则回退为原始字符串
    const parsed = tryParseJson(raw)
    return parsed.ok ? parsed.value : raw
  },

  set(key, value) {
    if (!canUseStorage) return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (_error) {
      // 忽略写入失败（配额、隐私模式等）
    }
  },

  remove(key) {
    if (!canUseStorage) return
    try {
      localStorage.removeItem(key)
    } catch (_error) {
      // 忽略
    }
  }
}

