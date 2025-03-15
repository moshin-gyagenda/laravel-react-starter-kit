"use client"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head, router, usePage } from "@inertiajs/react"
import { CreditCard, PlusCircle, Receipt, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import TopNav from "@/components/top-nav"

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface PageProps {
  auth: {
    user: User
  }
  [key: string]: any
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Payments",
    href: "/payments",
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
  payment_status: "unpaid" | "partially_paid" | "paid"
  amount_paid: number
  balance_due: number
  created_at: string
  customer: Customer
  user: PurchaseOrderUser
}

interface Payment {
  id: number
  purchase_order_id: number
  payment_number: string
  amount_paid: number
  payment_date: string
  payment_method: string
  status: string
  purchase_order: PurchaseOrder
}

interface Props {
  pendingOrders: {
    data: PurchaseOrder[]
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
  recentPayments?: {
    data: Payment[]
  }
}

export default function PaymentsIndex({ pendingOrders, recentPayments = { data: [] } }: Props) {
  const { auth } = usePage<PageProps>().props
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending")

  const filteredOrders = pendingOrders.data.filter(
    (order) =>
      order.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.customer.first_name} ${order.customer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.company_name?.toLowerCase().includes(searchTerm.toLowerCase()),
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
      case "partially_paid":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Partially Paid
          </Badge>
        )
      case "unpaid":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Unpaid
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "cash":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Cash
          </Badge>
        )
      case "bank_transfer":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Bank Transfer
          </Badge>
        )
      case "mobile_money":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Mobile Money
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="capitalize">
            {method.replace("_", " ")}
          </Badge>
        )
    }
  }

  return (
    <>
      <TopNav user={auth.user} />
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Payment Management" />

        <div className="container mx-auto py-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl font-bold">Payment Management</h1>
            <Button asChild className="w-full sm:w-auto">
              <a href="/purchase-orders/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Purchase Order
              </a>
            </Button>
          </div>

          {/* Custom Tab Navigation */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Payments
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "history"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Payment History
            </button>
          </div>

          {activeTab === "pending" && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Orders Requiring Payment</CardTitle>
                    <CardDescription>Manage payments for pending purchase orders</CardDescription>
                  </div>
                  <div className="w-full sm:w-64 flex items-center relative">
                    <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {pendingOrders.data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <PlaceholderPattern className="h-48 w-48 /30" />
                    <h3 className="mt-4 text-md font-medium">No pending payments</h3>
                    <p className="mt-2 text-center max-w-sm">All purchase orders have been paid in full.</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <h3 className="mt-4 text-md font-medium">No matching orders</h3>
                    <p className="mt-2 text-center max-w-sm">No orders match your search criteria.</p>
                    <Button variant="outline" className="mt-4 w-full sm:w-auto" onClick={() => setSearchTerm("")}>
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
                            <th className="py-3 px-4 text-left font-medium text-sm">Customer</th>
                            <th className="py-3 px-4 text-left font-medium hidden md:table-cell text-sm">Date</th>
                            <th className="py-3 px-4 text-center font-medium text-sm">Status</th>
                            <th className="py-3 px-4 text-right font-medium text-sm">Total</th>
                            <th className="py-3 px-4 text-right font-medium hidden md:table-cell text-sm">Paid</th>
                            <th className="py-3 px-4 text-right font-medium text-sm">Balance</th>
                            <th className="py-3 px-4 text-center text-sm">Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredOrders.map((order, index) => (
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
                              <td className="py-3 px-4 text-sm hidden md:table-cell">{formatDate(order.order_date)}</td>
                              <td className="py-3 px-4 text-sm text-center">
                                {getPaymentStatusBadge(order.payment_status)}
                              </td>
                              <td className="py-3 px-4 text-sm text-right">{formatCurrency(order.total_amount)}</td>
                              <td className="py-3 px-4 text-sm text-right hidden md:table-cell">
                                {formatCurrency(order.amount_paid)}
                              </td>
                              <td className="py-3 px-4 text-sm text-right font-medium">
                                {formatCurrency(order.balance_due)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Button variant="default" size="sm" className="w-full" asChild>
                                  <a href={`/payments/create/${order.id}`}>
                                    <CreditCard className="mr-1 h-3 w-3" />
                                    Make Payment
                                  </a>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile view - Cards */}
                    <div className="grid gap-4 sm:hidden">
                      {filteredOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 bg-card">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-medium">{order.po_number}</div>
                              <div className="text-sm text-muted-foreground">
                                {order.customer.first_name} {order.customer.last_name}
                              </div>
                            </div>
                            <div>{getPaymentStatusBadge(order.payment_status)}</div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                            <div>
                              <div className="text-muted-foreground">Total:</div>
                              <div className="font-medium">{formatCurrency(order.total_amount)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Date:</div>
                              <div>{formatDate(order.order_date)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Paid:</div>
                              <div>{formatCurrency(order.amount_paid)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Balance:</div>
                              <div className="font-medium text-primary">{formatCurrency(order.balance_due)}</div>
                            </div>
                          </div>

                          <Button variant="default" size="sm" className="w-full" asChild>
                            <a href={`/payments/create/${order.id}`}>
                              <CreditCard className="mr-1 h-4 w-4" />
                              Make Payment
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pendingOrders.meta && pendingOrders.data.length > 0 && (
                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      {`Showing ${pendingOrders.meta.from || 1} to ${pendingOrders.meta.to || pendingOrders.data.length} of ${pendingOrders.meta.total || pendingOrders.data.length} entries`}
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto">
                      {pendingOrders.meta.current_page > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.get(`/payments?page=${pendingOrders.meta!.current_page - 1}`)}
                        >
                          Previous
                        </Button>
                      )}
                      {pendingOrders.meta.current_page < pendingOrders.meta.last_page && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.get(`/payments?page=${pendingOrders.meta!.current_page + 1}`)}
                        >
                          Next
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "history" && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>View payment history</CardDescription>
              </CardHeader>
              <CardContent>
                {recentPayments.data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <PlaceholderPattern className="h-48 w-48 /30" />
                    <h3 className="mt-4 text-md font-medium">No payment history</h3>
                    <p className="mt-2 text-center max-w-sm">No payments have been recorded yet.</p>
                  </div>
                ) : (
                  <div>
                    {/* Desktop view - Table */}
                    <div className="hidden sm:block overflow-x-auto border rounded-lg">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="py-3 px-4 text-left font-medium text-sm">Payment #</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">PO Number</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Customer</th>
                            <th className="py-3 px-4 text-left font-medium hidden md:table-cell text-sm">Date</th>
                            <th className="py-3 px-4 text-center font-medium text-sm">Method</th>
                            <th className="py-3 px-4 text-right font-medium text-sm">Amount Paid</th>
                            <th className="py-3 px-4 text-center text-sm">Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {recentPayments.data.map((payment, index) => (
                            <tr
                              key={payment.id}
                              className={`border-b hover:bg-muted/50 transition-colors ${
                                index % 2 === 0 ? "bg-white" : "bg-muted/20"
                              }`}
                            >
                              <td className="py-3 px-4 text-sm font-medium">{payment.payment_number}</td>
                              <td className="py-3 px-4 text-sm">{payment.purchase_order.po_number}</td>
                              <td className="py-3 px-4 text-sm">
                                {payment.purchase_order.customer.first_name} {payment.purchase_order.customer.last_name}
                              </td>
                              <td className="py-3 px-4 text-sm hidden md:table-cell">
                                {formatDate(payment.payment_date)}
                              </td>
                              <td className="py-3 px-4 text-sm text-center">
                                {getPaymentMethodBadge(payment.payment_method)}
                              </td>
                              <td className="py-3 px-4 text-sm text-right font-medium">
                                {formatCurrency(payment.amount_paid)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Button variant="outline" size="sm" asChild>
                                  <a href={`/payments/${payment.id}`}>
                                    <Receipt className="mr-1 h-3 w-3" />
                                    View
                                  </a>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile view - Cards */}
                    <div className="grid gap-4 sm:hidden">
                      {recentPayments.data.map((payment) => (
                        <div key={payment.id} className="border rounded-lg p-4 bg-card">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-medium">{payment.payment_number}</div>
                              <div className="text-sm text-muted-foreground">{payment.purchase_order.po_number}</div>
                            </div>
                            <div>{getPaymentMethodBadge(payment.payment_method)}</div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                            <div className="col-span-2">
                              <div className="text-muted-foreground">Customer:</div>
                              <div>
                                {payment.purchase_order.customer.first_name} {payment.purchase_order.customer.last_name}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Amount Paid:</div>
                              <div className="font-medium">{formatCurrency(payment.amount_paid)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Date:</div>
                              <div>{formatDate(payment.payment_date)}</div>
                            </div>
                          </div>

                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <a href={`/payments/${payment.id}`}>
                              <Receipt className="mr-1 h-4 w-4" />
                              View Receipt
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </AppLayout>
    </>
  )
}

