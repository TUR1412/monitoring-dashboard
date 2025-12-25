// src/utils/sleep.js
// 演示工程的“可控延迟”能力：默认 0ms（零延迟），需要时可通过环境变量开启。

const toInt = (value, fallback = 0) => {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

// VITE_DEMO_LATENCY_MS:
// - 默认 0（生产与本地都“无人工延迟”）
// - 可在本地通过 `.env.local` 覆盖以演示 loading/skeleton
export const DEMO_LATENCY_MS = clamp(toInt(import.meta.env?.VITE_DEMO_LATENCY_MS, 0), 0, 5000)

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const demoSleep = (overrideMs) => {
  const ms = clamp(toInt(overrideMs, DEMO_LATENCY_MS), 0, 5000)
  if (!ms) return Promise.resolve()
  return sleep(ms)
}

