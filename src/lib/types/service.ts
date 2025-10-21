export interface ServiceRoot {
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
  price: string
  duration: string
  description: string
  File:File
  category_id: string
  type_id: string
    ServiceCategory: ServiceCategory
  CategoryType: CategoryType
  discount: number
  rating: number
  review_id: any
  file_id: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface Meta {
  limit: number
  offset: number
  total: number
}

export interface ServiceCategory {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface CategoryType {
  id: string
  name: string
  description: string
  service_category_id: string
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
