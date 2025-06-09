import { StatsCards } from '@/components/dashboard/StatsCards'
import { RevenueChart } from '@/components/dashboard/RevenueChart'

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to your dashboard overview
                </p>
            </div>

            {/* Stats Cards */}
            <StatsCards />

            {/* Charts */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
                <RevenueChart />
            </div>
        </div>
    )
}