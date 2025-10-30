export type Booking_View = Root2[]

export interface Root2 {
  id: string
  user_id: string
  service_id: string
  date: string
  time: string
  promo_code_id: any
  price: string
  is_checked_in: any
  by_reedem: any
  status: string
  service_details: ServiceDetails
  createdAt: string
  updatedAt: string
  deletedAt: any
  User: User
  booking_services: BookingService[]
}

export interface ServiceDetails {
  adultNumber: number
  serviceIds: string[]
}

export interface User {
  id: string
  name: string
  phone_number: string
}

export interface BookingService {
  id: string
  booking_id: string
  service_id: string
  price: number
  duration: any
  person_type: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  service: Service
}

export interface Service {
  id: string
  name: string
  price: string
  duration: string
}
