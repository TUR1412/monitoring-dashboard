export type AlertType = 'success' | 'warning' | 'error' | 'info'

export interface Permission {
  id: number
  name: string
  enabled: boolean
}

export interface Role {
  id: number
  name: string
  permissions: Permission[]
}
