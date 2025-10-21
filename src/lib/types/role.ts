export interface RoleRoot {
  status: string
  message: string
  count: number
  data: RoleDaum[]
  meta: Meta
  timestamp: string
}

export interface RoleDaum {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface Meta {
  limit: number
  offset: number
  total: number
}
