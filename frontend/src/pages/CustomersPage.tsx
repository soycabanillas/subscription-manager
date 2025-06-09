import React, { useState } from 'react'
import { CustomersTable } from '@/components/dashboard/CustomersTable'
import { CustomerForm } from '@/components/dashboard/CustomerForm'
import type { Customer } from '@/types'

export default function CustomersPage() {
    const [showForm, setShowForm] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>()

    const handleAdd = () => {
        setEditingCustomer(undefined)
        setShowForm(true)
    }

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer)
        setShowForm(true)
    }

    const handleFormSuccess = () => {
        setShowForm(false)
        setEditingCustomer(undefined)
    }

    const handleFormCancel = () => {
        setShowForm(false)
        setEditingCustomer(undefined)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                <p className="text-muted-foreground">
                    Manage your customer database
                </p>
            </div>

            {showForm ? (
                <CustomerForm
                    customer={editingCustomer}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            ) : (
                <CustomersTable onEdit={handleEdit} onAdd={handleAdd} />
            )}
        </div>
    )
}