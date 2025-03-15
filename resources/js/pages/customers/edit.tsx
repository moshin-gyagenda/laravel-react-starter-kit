"use client"
import type React from "react"

import { Head, useForm, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, User } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import TopNav from "@/components/top-nav"

interface PageProps {
  auth: {
    user: User
  }
  [key: string]: any
}

interface Customer {
  id: number
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  company_name: string | null
  location: string | null
  type: string
  status: string
  credit_limit: number | null
  outstanding_balance: number
}

interface CustomerFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  company_name: string
  location: string
  type: string
  status: string
  credit_limit: string
  outstanding_balance: string
  [key: string]: string
}

interface EditCustomerProps {
  customer: Customer
}

export default function EditCustomer({ customer }: EditCustomerProps) {
  const { auth } = usePage<PageProps>().props

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Customers",
      href: "/customers",
    },
    {
      title: customer.first_name + " " + customer.last_name,
      href: `/customers/${customer.id}/edit`,
    },
  ]

  const { data, setData, put, processing, errors } = useForm<CustomerFormData>({
    first_name: customer.first_name || "",
    last_name: customer.last_name || "",
    email: customer.email || "",
    phone: customer.phone || "",
    company_name: customer.company_name || "",
    location: customer.location || "",
    type: customer.type || "individual",
    status: customer.status || "active",
    credit_limit: customer.credit_limit?.toString() || "",
    outstanding_balance: customer.outstanding_balance?.toString() || "0",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(`/customers/${customer.id}/update`)
  }

  const typeOptions = ["individual", "business"]
  const statusOptions = ["active", "inactive", "blocked"]

  return (
    <>
      <TopNav user={auth.user} />
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={`Edit Customer - ${customer.first_name} ${customer.last_name}`} />

        <div className="container mx-auto py-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl font-bold">Edit Customer</h1>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customers
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
                <CardDescription>Update the details of this customer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Column 1 - Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="first_name">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="first_name"
                        value={data.first_name}
                        onChange={(e) => setData("first_name", e.target.value)}
                        placeholder="Enter first name"
                        required
                      />
                      {errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last_name">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="last_name"
                        value={data.last_name}
                        onChange={(e) => setData("last_name", e.target.value)}
                        placeholder="Enter last name"
                        required
                      />
                      {errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="Enter email address"
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Column 2 - Business Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Business Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input
                        id="company_name"
                        value={data.company_name}
                        onChange={(e) => setData("company_name", e.target.value)}
                        placeholder="Enter company name"
                      />
                      {errors.company_name && <p className="text-sm text-destructive">{errors.company_name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={data.location}
                        onChange={(e) => setData("location", e.target.value)}
                        placeholder="Enter location"
                      />
                      {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Customer Type</Label>
                      <Select value={data.type} onValueChange={(value) => setData("type", value)}>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select customer type" />
                        </SelectTrigger>
                        <SelectContent>
                          {typeOptions.map((type) => (
                            <SelectItem key={type} value={type} className="capitalize">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={data.status} onValueChange={(value) => setData("status", value)}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status} className="capitalize">
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                    </div>
                  </div>

                  {/* Column 3 - Financial Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Financial Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="credit_limit">Credit Limit</Label>
                      <Input
                        id="credit_limit"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.credit_limit}
                        onChange={(e) => setData("credit_limit", e.target.value)}
                        placeholder="Enter credit limit"
                      />
                      {errors.credit_limit && <p className="text-sm text-destructive">{errors.credit_limit}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="outstanding_balance">Outstanding Balance</Label>
                      <Input
                        id="outstanding_balance"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.outstanding_balance}
                        onChange={(e) => setData("outstanding_balance", e.target.value)}
                        placeholder="Enter outstanding balance"
                      />
                      {errors.outstanding_balance && (
                        <p className="text-sm text-destructive">{errors.outstanding_balance}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  <Save className="mr-2 h-4 w-4" />
                  Update Customer
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </AppLayout>
    </>
  )
}

