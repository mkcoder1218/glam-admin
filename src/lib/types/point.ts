export interface PointRoot {
  status: string
  message: string
  count: number
  data: Daum[]
  meta: Meta
  timestamp: string
}

export interface Daum {
  id: string
  point: number
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface Meta {
  limit: number
  offset: number
  total: number
}
