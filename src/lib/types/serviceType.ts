export interface serviceTypeRoot {
  status: string
  message: string
  count: number
  data: Daum[]
  meta: Meta
  timestamp: string
}

export interface Daum {
  id: string
  name: string
  description: string
  service_category_id: string
  createdAt: string
  
  updatedAt: string
  deletedAt: any
}

export interface Meta {
  limit: number
  offset: number
  total: number
}


