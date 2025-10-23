export interface galleryRoot {
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
  file_id: string
  description: string
  File:File,
  createdAt: string
  updatedAt: string
  deletedAt: any
}
export interface File {
  id: string
  description: any
  url: any
  path: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface Meta {
  limit: number
  offset: number
  total: number
}
