export interface analyticsRoot {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  totalUsers: number
  totalBookings: number
  totalRevenue: number
  growth: Growth
    monthlyRevenue: MonthlyRevenue[]

}

export interface Growth {
  thisMonthRevenue: number
  lastMonthRevenue: number
  growthRate: number
}
export interface MonthlyRevenue {
  month: string
  revenue: number
}