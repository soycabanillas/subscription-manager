import { create } from 'zustand'

interface DashboardState {
    sidebarOpen: boolean
    dateRange: {
        from: Date
        to: Date
    }
    setSidebarOpen: (open: boolean) => void
    setDateRange: (range: { from: Date; to: Date }) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
    sidebarOpen: true,
    dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        to: new Date(),
    },

    setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

    setDateRange: (range: { from: Date; to: Date }) => set({ dateRange: range }),
}))