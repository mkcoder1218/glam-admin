export interface PromoRoot {
  status: string
  message: string
  count: number
  data: Daum[]
  meta: Meta
  timestamp: string
}

export interface Daum {
  id: string
  code: string
  discount: number
  valid_until: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface Meta {
  limit: number
  offset: number
  total: number
}
