"use client"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, User } from "@/types"
import { Head, router, usePage } from "@inertiajs/react"
import { Edit, MoreHorizontal, PlusCircle, Trash2, FileText } from "lucide-react"
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
import TopNav from "@/components/top-nav"

interface PageProps {
  auth: {
    user: User
  }
  [key: string]: any
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Purchase Orders",
    href: "/purchase-orders",
  },
]

interface Customer {
  id: number
  first_name: string
  last_name: string
  company_name: string | null
}

interface PurchaseOrderUser {
  id: number
  name: string
}

interface PurchaseOrder {
  id: number
  po_number: string
  customer_id: number
  user_id: number
  order_date: string
  total_amount: number
  payment_status: "paid" | "pending" | "partial" | "cancelled"
  created_at: string
  customer: Customer
  user: PurchaseOrderUser
}

interface Props {
  purchaseOrders: {
    data: PurchaseOrder[]
    links?: any
    meta?: {
      current_page: number
      from: number
      last_page: number
      path: string
      per_page: number
      to: number
      total: number
    }
  }
}

export default function PurchaseOrders({ purchaseOrders }: Props) {
  const { auth } = usePage<PageProps>().props
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPurchaseOrders = purchaseOrders.data.filter(
    (order) =>
      order.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.customer.first_name} ${order.customer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "partial":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Partial
          </Badge>
        )
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <>
      <TopNav user={auth.user} />
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Purchase Orders" />

        <div className="container mx-auto py-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl font-bold">Purchase Order Management</h1>
            <Button asChild>
              <a href="/purchase-orders/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Purchase Order
              </a>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>Manage your purchase orders here</CardDescription>
                </div>
                <div className="w-full sm:w-64">
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {purchaseOrders.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <PlaceholderPattern className="h-48 w-48 /30" />
                  <h3 className="mt-4 text-md font-medium">No purchase orders</h3>
                  <p className="mt-2 text-center max-w-sm">
                    You don't have any purchase orders yet. Create your first order to get started.
                  </p>
                  <Button asChild className="mt-4">
                    <a href="/purchase-orders/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Order
                    </a>
                  </Button>
                </div>
              ) : filteredPurchaseOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <h3 className="mt-4 text-md font-medium">No matching purchase orders</h3>
                  <p className="mt-2 text-center max-w-sm">No purchase orders match your search criteria.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div>
                  {/* Desktop view - Table */}
                  <div className="hidden sm:block overflow-x-auto border rounded-lg">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium text-sm">PO Number</th>
                          <th className="py-3 px-4 text-left font-medium">Customer</th>
                          <th className="py-3 px-4 text-left font-medium hidden md:table-cell text-sm">Created By</th>
                          <th className="py-3 px-4 text-left font-medium hidden lg:table-cell text-sm">Order Date</th>
                          <th className="py-3 px-4 text-center font-medium text-sm">Status</th>
                          <th className="py-3 px-4 text-right font-medium text-sm">Amount</th>
                          <th className="py-3 px-4 w-[80px] text-center text-sm">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredPurchaseOrders.map((order, index) => (
                          <tr
                            key={order.id}
                            className={`border-b hover:bg-muted/50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-muted/20"
                            }`}
                          >
                            <td className="py-3 px-4 text-sm font-medium">{order.po_number}</td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-sm">
                                {order.customer.first_name} {order.customer.last_name}
                              </div>
                              {order.customer.company_name && (
                                <div className="text-sm text-muted-foreground">{order.customer.company_name}</div>
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm hidden md:table-cell">{order.user.name}</td>
                            <td className="py-3 px-4 text-sm hidden lg:table-cell">{formatDate(order.order_date)}</td>
                            <td className="py-3 px-4 text-sm text-center">
                              {getPaymentStatusBadge(order.payment_status)}
                            </td>
                            <td className="py-3 px-4 text-sm text-right font-medium">
                              {formatCurrency(order.total_amount)}
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
                                    <a
                                      href={`/purchase-orders/${order.id}/show`}
                                      className="flex items-center cursor-pointer"
                                    >
                                      <FileText className="mr-2 h-4 w-4" />
                                      View
                                    </a>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <a
                                      href={`/purchase-orders/${order.id}/edit`}
                                      className="flex items-center cursor-pointer"
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </a>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <a
                                      href={`/purchase-orders/${order.id}/delete`}
                                      className="flex items-center text-destructive cursor-pointer"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        if (confirm("Are you sure you want to delete this purchase order?")) {
                                          router.delete(`/purchase-orders/${order.id}/delete`)
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

                  {/* Mobile view - Cards */}
                  <div className="grid gap-4 sm:hidden">
                    {filteredPurchaseOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 bg-card">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">{order.po_number}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.customer.first_name} {order.customer.last_name}
                            </div>
                          </div>
                          <div>{getPaymentStatusBadge(order.payment_status)}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <div className="text-muted-foreground">Amount:</div>
                            <div className="font-medium">{formatCurrency(order.total_amount)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Date:</div>
                            <div>{formatDate(order.order_date)}</div>
                          </div>
                          {order.customer.company_name && (
                            <div className="col-span-2">
                              <div className="text-muted-foreground">Company:</div>
                              <div>{order.customer.company_name}</div>
                            </div>
                          )}
                          <div className="col-span-2">
                            <div className="text-muted-foreground">Created By:</div>
                            <div>{order.user.name}</div>
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end mt-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/purchase-orders/${order.id}/show`}>
                              <FileText className="mr-1 h-3 w-3" />
                              View
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/purchase-orders/${order.id}/edit`}>
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this purchase order?")) {
                                router.delete(`/purchase-orders/${order.id}/delete`)
                              }
                            }}
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  {purchaseOrders.meta
                    ? `Showing ${purchaseOrders.meta.from || 1} to ${purchaseOrders.meta.to || purchaseOrders.data.length} of ${purchaseOrders.meta.total || purchaseOrders.data.length} entries`
                    : `Showing ${purchaseOrders.data.length} entries`}
                </div>
                <div className="flex gap-2 self-end sm:self-auto">
                  {purchaseOrders.meta && purchaseOrders.meta.current_page > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        purchaseOrders.meta &&
                        router.get(`/purchase-orders?page=${purchaseOrders.meta.current_page - 1}`)
                      }
                    >
                      Previous
                    </Button>
                  )}
                  {purchaseOrders.meta && purchaseOrders.meta.current_page < purchaseOrders.meta.last_page && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        purchaseOrders.meta &&
                        router.get(`/purchase-orders?page=${purchaseOrders.meta.current_page + 1}`)
                      }
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </>
  )
}

