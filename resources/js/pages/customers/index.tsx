"use client"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head, router } from "@inertiajs/react"
import { Edit, MoreHorizontal, PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Customers",
    href: "/customers",
  },
]

interface Customer {
  id: number
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  company_name: string | null
  location: string | null
  type: "individual" | "business"
  status: "active" | "inactive" | "blocked"
  credit_limit: number | null
  outstanding_balance: number
}

interface Props {
  customers?: Customer[]
}

export default function Customers({ customers = [] }: Props) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "—"
    return `UGX ${amount.toLocaleString()}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Inactive
          </Badge>
        )
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Customers" />

      <div className="container mx-auto py-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl font-bold">Customer Management</h1>
          <Button asChild>
            <a href="/customers/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </a>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Customers</CardTitle>
                <CardDescription>Manage your customers here</CardDescription>
              </div>
              <div className="w-full sm:w-64">
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {customers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <PlaceholderPattern className="h-48 w-48 /30" />
                <h3 className="mt-4 text-md font-medium">No customers</h3>
                <p className="mt-2 text-center max-w-sm">
                  You don't have any customers yet. Add your first customer to get started.
                </p>
                <Button asChild className="mt-4">
                  <a href="/customers/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Customer
                  </a>
                </Button>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <h3 className="mt-4 text-md font-medium">No matching customers</h3>
                <p className="mt-2 text-center max-w-sm">No customers match your search criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium text-sm">ID</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Name</th>
                      <th className="py-3 px-4 text-left font-medium hidden md:table-cell text-sm">Contact</th>
                      <th className="py-3 px-4 text-left font-medium hidden lg:table-cell text-sm">Company</th>
                      <th className="py-3 px-4 text-center font-medium text-sm">Type</th>
                      <th className="py-3 px-4 text-center font-medium text-sm">Status</th>
                      <th className="py-3 px-4 text-right font-medium hidden md:table-cell text-sm">Balance</th>
                      <th className="py-3 px-4 w-[80px] text-center text-sm">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCustomers.map((customer, index) => (
                      <tr
                        key={customer.id}
                        className={`border-b hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-muted/20"
                        }`}
                      >
                        <td className="py-3 px-4 hidden text-sm lg:table-cell">{customer.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-sm">
                            {customer.first_name} {customer.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground md:hidden">{customer.email}</div>
                        </td>
                        <td className="py-3 px-4 text-sm hidden md:table-cell">
                          <div>{customer.email || "—"}</div>
                          <div className="text-muted-foreground">{customer.phone || "—"}</div>
                        </td>
                        <td className="py-3 px-4 text-sm hidden lg:table-cell">
                          {customer.company_name || "—"}
                          {customer.location && (
                            <div className="text-xs text-muted-foreground">{customer.location}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-center capitalize">{customer.type}</td>
                        <td className="py-3 px-4 text-sm text-center">{getStatusBadge(customer.status)}</td>
                        <td className="py-3 px-4 hidden text-sm md:table-cell text-right">
                          {formatCurrency(customer.outstanding_balance)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <a href={`/customers/${customer.id}/edit`} className="flex items-center cursor-pointer">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a
                                  href={`/customers/${customer.id}`}
                                  className="flex items-center text-destructive cursor-pointer"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    if (confirm("Are you sure you want to delete this customer?")) {
                                      // Using Inertia to handle the delete request
                                      router.delete(`/customers/${customer.id}/delete`)
                                    }
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </a>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

