import React from 'react'
import { ArrowUpIcon, ArrowDownIcon, DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboardStats } from '@/hooks/use-dashboard'
import { useDashboardStore } from '@/stores/dashboard-store'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils'

interface StatCardProps {
    title: string
    value: string
    change: number
    icon: React.ElementType
    loading?: boolean
}

function StatCard({ title, value, change, icon: Icon, loading }: StatCardProps) {
    const isPositive = change >= 0

    if (loading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground animate-pulse" />
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                    {isPositive ? (
                        <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
                    ) : (
                        <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
                    )}
                    <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                        {formatPercentage(Math.abs(change))}
                    </span>
                    <span className="ml-1">from last month</span>
                </div>
            </CardContent>
        </Card>
    )
}

export function StatsCards() {
    const { dateRange } = useDashboardStore()
    const { data: stats, isLoading } = useDashboardStats(dateRange)

    const statsConfig = [
        {
            title: 'Total Revenue',
            value: stats ? formatCurrency(stats.totalRevenue) : '$0',
            change: stats?.revenueGrowth ?? 0,
            icon: DollarSign,
        },
        {
            title: 'Total Users',
            value: stats ? formatNumber(stats.totalUsers) : '0',
            change: stats?.userGrowth ?? 0,
            icon: Users,
        },
        {
            title: 'Total Orders',
            value: stats ? formatNumber(stats.totalOrders) : '0',
            change: stats?.orderGrowth ?? 0,
            icon: ShoppingCart,
        },
        {
            title: 'Conversion Rate',
            value: stats ? formatPercentage(stats.conversionRate) : '0%',
            change: stats?.conversionGrowth ?? 0,
            icon: TrendingUp,
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsConfig.map((stat) => (
                <StatCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    change={stat.change}
                    icon={stat.icon}
                    loading={isLoading}
                />
            ))}
        </div>
    )
}