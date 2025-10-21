export interface getUserRoot {
  status: string
  message: string
  count: number
  data: getUserDaum[]
  meta: Meta
  timestamp: string
}

export interface getUserDaum {
  id: string
  name: string
  phone_number?: string
  password: string
  role_id: string
  point?: number
  createdAt: string
  updatedAt: string
  status:string
  deletedAt: any
  notification_id: any
}

export interface Meta {
  limit: number
  offset: number
}
