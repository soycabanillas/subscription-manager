export interface User {
    id: string
    email: string
    name: string
    role: 'admin' | 'user'
}

export interface AuthResponse {
    token: string
    user: User
}

export interface LoginRequest {
    email: string
    password: string
}

export interface DashboardStats {
    totalUsers: number
    totalRevenue: number
    totalOrders: number
    conversionRate: number
    userGrowth: number
    revenueGrowth: number
    orderGrowth: number
    conversionGrowth: number
}

export interface ChartData {
    date: string
    revenue: number
    users: number
    orders: number
}

export interface Customer {
    id: string
    name: string
    email: string
    status: 'active' | 'inactive'
    totalSpent: number
    orders: number
    joinedAt: string
}

export interface PaginationParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface CreateCustomerRequest {
    name: string
    email: string
    status: 'active' | 'inactive'
}

export interface UpdateCustomerRequest extends CreateCustomerRequest {
    id: string
}