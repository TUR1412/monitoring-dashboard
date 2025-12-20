// src/types/alerts.ts
export type AlertLevel = 'critical' | 'error' | 'warning' | 'info'
export type TimeFilter = 'all' | '1h' | '24h' | '7d' | '30d'

export interface Alert {
  id: string | number
  level: AlertLevel
  title: string
  message: string
  timestamp: number | string
  source: string
  acknowledged: boolean
  acknowledgedAt?: number | null
  muted: boolean
  archived: boolean
  resolvedAt?: number | null
}
