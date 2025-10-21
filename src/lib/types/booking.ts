export interface BookingRoot {
  status: string
  message: string
  count: number
  data: Daum[]
  meta: Meta
  timestamp: string
}

export interface Daum {
  id: string
  user_id: string
  service_id: string
  date: string
  time: string
  promo_code_id: any
  price: string
  is_checked_in: boolean
  status: string
  service_details?: ServiceDetails
  createdAt: string
  updatedAt: string
  deletedAt: any
  User: User
  Service:Services
}

export interface Services {
  id: string
  name: string
  price: string
  duration: string
  description: string
  category_id: string
  type_id: string
  discount: number
  rating: number
  review_id: any
  file_id: any
  createdAt: string
  updatedAt: string
  deletedAt: any
}


export interface ServiceDetails {
  adultNumber: number
  serviceIds: string[]
}

export interface User {
  id: string
  name: string
  phone_number?: string
  status: string
  password: string
  role_id: string
  point: number
  createdAt: string
  updatedAt: string
  deletedAt: any
  notification_id: any
}

export interface Meta {
  limit: number
  offset: number
  total: number
}
