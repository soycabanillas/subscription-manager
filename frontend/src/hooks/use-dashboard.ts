import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type {
    DashboardStats,
    ChartData,
    Customer,
    PaginatedResponse,
    PaginationParams,
    CreateCustomerRequest,
    UpdateCustomerRequest,
    AuthResponse,
    LoginRequest,
} from '@/types'

// Auth hooks
export const useLogin = () => {
    return useMutation<AuthResponse, Error, LoginRequest>({
        mutationFn: async (credentials) => {
            const response = await api.post('/auth/login', credentials)
            return response.data
        },
    })
}

// Chart data
export const useChartData = (dateRange?: { from: Date; to: Date }) => {
    return useQuery<ChartData[]>({
        queryKey: ['chart-data', dateRange],
        queryFn: async () => {
            const params = dateRange
                ? {
                    from: dateRange.from.toISOString(),
                    to: dateRange.to.toISOString(),
                }
                : {}

            const response = await api.get('/dashboard/chart-data', { params })
            return response.data
        },
        staleTime: 5 * 60 * 1000,
    })
}

// Customers
export const useCustomers = (params: PaginationParams) => {
    return useQuery<PaginatedResponse<Customer>>({
        queryKey: ['customers', params],
        queryFn: async () => {
            const response = await api.get('/customers', { params })
            return response.data
        },
        placeholderData: (prev) => prev
    })
}

export const useCreateCustomer = () => {
    const queryClient = useQueryClient()

    return useMutation<Customer, Error, CreateCustomerRequest>({
        mutationFn: async (data) => {
            const response = await api.post('/customers', data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
        },
    })
}

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient()

    return useMutation<Customer, Error, UpdateCustomerRequest>({
        mutationFn: async (data) => {
            const response = await api.put(`/customers/${data.id}`, data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
        },
    })
}

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: async (id) => {
            await api.delete(`/customers/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
        },
    })
}

// Dashboard stats
export const useDashboardStats = (dateRange?: { from: Date; to: Date }) => {
    return useQuery<DashboardStats>({
        queryKey: ['dashboard-stats', dateRange],
        queryFn: async () => {
            const params = dateRange
                ? {
                    from: dateRange.from.toISOString(),
                    to: dateRange.to.toISOString(),
                }
                : {}

            const response = await api.get('/dashboard/stats', { params })
            return response.data
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}