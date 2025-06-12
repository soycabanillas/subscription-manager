import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    createColumnHelper,
    flexRender,
    type ColumnDef,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, Plus, Edit, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCustomers, useDeleteCustomer } from '@/hooks/use-dashboard'
import { formatCurrency } from '@/lib/utils'
import type { Customer } from '@/types'
import { useState } from 'react'

interface CustomersTableProps {
    onEdit: (customer: Customer) => void
    onAdd: () => void
}

const columnHelper = createColumnHelper<Customer>()

export function CustomersTable({ onEdit, onAdd }: CustomersTableProps) {
    const [search, setSearch] = useState('')
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const { data, isLoading } = useCustomers({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: search || undefined,
    })

    const deleteCustomer = useDeleteCustomer()

    const columns: ColumnDef<Customer, any>[] = [
        columnHelper.accessor('name', {
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-transparent p-0 font-semibold"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: (info) => (
                <div className="font-medium">{info.getValue()}</div>
            ),
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            cell: (info) => (
                <div className="text-muted-foreground">{info.getValue()}</div>
            ),
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: (info) => {
                const status = info.getValue()
                return (
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        {status}
                    </span>
                )
            },
        }),
        columnHelper.accessor('totalSpent', {
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-transparent p-0 font-semibold"
                >
                    Total Spent
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: (info) => (
                <div className="font-medium">{formatCurrency(info.getValue())}</div>
            ),
        }),
        columnHelper.accessor('orders', {
            header: 'Orders',
            cell: (info) => (
                <div className="text-center">{info.getValue()}</div>
            ),
        }),
        columnHelper.accessor('joinedAt', {
            header: 'Joined',
            cell: (info) => (
                <div className="text-muted-foreground">
                    {new Date(info.getValue()).toLocaleDateString()}
                </div>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(row.original)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCustomer.mutate(row.original.id)}
                        disabled={deleteCustomer.isPending}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            ),
        }),
    ]

    const table = useReactTable({
        data: data?.data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
            globalFilter: search,
        },
        onGlobalFilterChange: setSearch,
        pageCount: data?.totalPages ?? 0,
        manualPagination: true,
    })

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Customers</CardTitle>
                    <Button onClick={onAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Customer
                    </Button>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search customers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-pulse text-muted-foreground">
                            Loading customers...
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id} className="border-b bg-muted/50">
                                            {headerGroup.headers.map((header) => (
                                                <th
                                                    key={header.id}
                                                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="border-b transition-colors hover:bg-muted/50"
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <td key={cell.id} className="p-4 align-middle">
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={columns.length}
                                                className="h-24 text-center text-muted-foreground"
                                            >
                                                No customers found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {data?.data.length ?? 0} of {data?.total ?? 0} customers
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}