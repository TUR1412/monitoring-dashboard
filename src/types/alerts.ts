// src/types/alerts.ts
export type AlertLevel = 'critical' | 'error' | 'warning' | 'info'
export type TimeFilter = '1h' | '24h' | '7d'

export interface Alert {
  id: string
  level: AlertLevel
  title: string
  message: string
  timestamp: number | string
  source: string
  acknowledged: boolean
  muted: boolean
  archived: boolean
}