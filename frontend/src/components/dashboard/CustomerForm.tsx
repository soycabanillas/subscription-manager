import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/use-dashboard'
import type { Customer } from '@/types'

const customerSchema = z.object({
    name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    status: z.enum(['active', 'inactive']),
})

type CustomerFormData = z.infer<typeof customerSchema>

interface CustomerFormProps {
    customer?: Customer
    onSuccess: () => void
    onCancel: () => void
}

export function CustomerForm({ customer, onSuccess, onCancel }: CustomerFormProps) {
    const isEditing = !!customer
    const createCustomer = useCreateCustomer()
    const updateCustomer = useUpdateCustomer()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            name: customer?.name ?? '',
            email: customer?.email ?? '',
            status: customer?.status ?? 'active',
        },
    })

    const onSubmit = async (data: CustomerFormData) => {
        try {
            if (isEditing) {
                await updateCustomer.mutateAsync({
                    id: customer.id,
                    ...data,
                })
            } else {
                await createCustomer.mutateAsync(data)
            }
            onSuccess()
        } catch (error) {
            console.error('Failed to save customer:', error)
        }
    }

    const isPending = createCustomer.isPending || updateCustomer.isPending

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>
                    {isEditing ? 'Edit Customer' : 'Add New Customer'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Name
                        </label>
                        <Input
                            id="name"
                            placeholder="Enter customer name"
                            {...register('name')}
                            disabled={isPending}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter email address"
                            {...register('email')}
                            disabled={isPending}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="status" className="text-sm font-medium">
                            Status
                        </label>
                        <select
                            id="status"
                            {...register('status')}
                            disabled={isPending}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        {errors.status && (
                            <p className="text-sm text-red-500">{errors.status.message}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 pt-4">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1"
                        >
                            {isPending
                                ? 'Saving...'
                                : isEditing
                                    ? 'Update Customer'
                                    : 'Create Customer'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isPending}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>

                    {(createCustomer.error || updateCustomer.error) && (
                        <p className="text-sm text-red-500 text-center">
                            Failed to {isEditing ? 'update' : 'create'} customer. Please try again.
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}