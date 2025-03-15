"use client"
import { useState } from "react"
import { Head, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, User } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, CreditCard, Printer, FileText, ChevronDown, ChevronUp, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
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
  company_name: string | null
  email: string | null
  phone: string | null
  location: string | null
}

interface PurchaseOrderUser {
  id: number
  name: string
}

interface PurchaseOrderItem {
  id: number
  purchase_order_id: number
  inventory_id: number
  quantity: number
  unit: string
  unit_price: number
  tax_rate: number
  tax_amount: number
  discount_rate: number
  discount_amount: number
  subtotal: number
  total: number
  inventory: {
    id: number
    name: string
    packaging_type: string
    selling_price: number
  }
}

interface PurchaseOrder {
  id: number
  po_number: string
  customer_id: number
  user_id: number
  order_date: string
  payment_terms: string
  payment_status: "unpaid" | "partially_paid" | "paid"
  subtotal: number
  tax_amount: number
  shipping_cost: number
  discount_amount: number
  total_amount: number
  amount_paid: number
  balance_due: number
  created_at: string
  updated_at: string
  customer: Customer
  user: PurchaseOrderUser
  items: PurchaseOrderItem[]
}

interface Payment {
  id: number
  purchase_order_id: number
  payment_number: string
  amount_paid: number
  payment_date: string
  payment_method: string
  status: string
}

interface ShowPurchaseOrderProps {
  purchaseOrder: PurchaseOrder
  payments: Payment[]
}

export default function ShowPurchaseOrder({ purchaseOrder, payments = [] }: ShowPurchaseOrderProps) {
  const { auth } = usePage<PageProps>().props
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Purchase Orders",
      href: "/purchase-orders",
    },
    {
      title: purchaseOrder.po_number,
      href: `/purchase-orders/${purchaseOrder.id}`,
    },
  ]

  const toggleItemExpand = (index: number) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((i) => i !== index))
    } else {
      setExpandedItems([...expandedItems, index])
    }
  }

  const formatCurrency = (amount: number) => {
    return `UGX ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP")
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
      case "credit_card":
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            Credit Card
          </Badge>
        )
      case "check":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Check
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
        <Head title={`Purchase Order: ${purchaseOrder.po_number}`} />

        <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold">Purchase Order: {purchaseOrder.po_number}</h1>
              <p className="text-muted-foreground">Created on {formatDate(purchaseOrder.created_at)}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              {purchaseOrder.payment_status !== "paid" && (
                <Button className="w-full sm:w-auto" asChild>
                  <a href={`/payments/create/${purchaseOrder.id}`}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Make Payment
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6">
            {/* Status Banner */}
            <div className="bg-muted p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="font-medium">Status:</div>
                <div>{getPaymentStatusBadge(purchaseOrder.payment_status)}</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
                <div className="flex justify-between sm:block">
                  <span className="text-muted-foreground sm:mr-2">Total:</span>
                  <span className="font-bold">{formatCurrency(purchaseOrder.total_amount)}</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-muted-foreground sm:mr-2">Paid:</span>
                  <span className="font-medium">{formatCurrency(purchaseOrder.amount_paid)}</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-muted-foreground sm:mr-2">Balance:</span>
                  <span className="font-medium text-primary">{formatCurrency(purchaseOrder.balance_due)}</span>
                </div>
              </div>
            </div>

            {/* Customer Information Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">
                        {purchaseOrder.customer.company_name
                          ? purchaseOrder.customer.company_name
                          : `${purchaseOrder.customer.first_name} ${purchaseOrder.customer.last_name}`}
                      </h3>
                      {purchaseOrder.customer.company_name && (
                        <p>
                          {purchaseOrder.customer.first_name} {purchaseOrder.customer.last_name}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {purchaseOrder.customer.email && (
                        <div>
                          <span className="text-muted-foreground block">Email:</span>
                          <span className="break-words">{purchaseOrder.customer.email}</span>
                        </div>
                      )}
                      {purchaseOrder.customer.phone && (
                        <div>
                          <span className="text-muted-foreground block">Phone:</span>
                          <span>{purchaseOrder.customer.phone}</span>
                        </div>
                      )}
                      {purchaseOrder.customer.location && (
                        <div className="sm:col-span-2">
                          <span className="text-muted-foreground block">Location:</span>
                          <span>{purchaseOrder.customer.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block">PO Number:</span>
                      <span className="font-medium">{purchaseOrder.po_number}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Order Date:</span>
                      <span>{formatDate(purchaseOrder.order_date)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Payment Terms:</span>
                      <span>{purchaseOrder.payment_terms}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Created By:</span>
                      <span>{purchaseOrder.user.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Items Card */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>Items included in this purchase order</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Desktop Table View (hidden on mobile) */}
                <div className="hidden md:block rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Tax</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseOrder.items.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                            No items in this purchase order.
                          </TableCell>
                        </TableRow>
                      ) : (
                        purchaseOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.inventory.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                            <TableCell>
                              {item.tax_rate}% ({formatCurrency(item.tax_amount)})
                            </TableCell>
                            <TableCell>
                              {item.discount_rate}% ({formatCurrency(item.discount_amount)})
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View (hidden on desktop) */}
                <div className="md:hidden space-y-4">
                  {purchaseOrder.items.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground border rounded-md p-4">
                      No items in this purchase order.
                    </div>
                  ) : (
                    purchaseOrder.items.map((item, index) => (
                      <div key={item.id} className="border rounded-md overflow-hidden">
                        <div
                          className="flex items-center justify-between p-3 bg-muted/30 cursor-pointer"
                          onClick={() => toggleItemExpand(index)}
                        >
                          <div className="font-medium">{item.inventory.name}</div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">{formatCurrency(item.total)}</div>
                            {expandedItems.includes(index) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </div>

                        {expandedItems.includes(index) && (
                          <div className="p-3 space-y-3 border-t">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <span className="text-muted-foreground block text-sm">Quantity:</span>
                                <span>{item.quantity}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-sm">Unit:</span>
                                <span>{item.unit}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <span className="text-muted-foreground block text-sm">Unit Price:</span>
                                <span>{formatCurrency(item.unit_price)}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-sm">Subtotal:</span>
                                <span>{formatCurrency(item.subtotal)}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <span className="text-muted-foreground block text-sm">Tax:</span>
                                <span>
                                  {item.tax_rate}% ({formatCurrency(item.tax_amount)})
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-sm">Discount:</span>
                                <span>
                                  {item.discount_rate}% ({formatCurrency(item.discount_amount)})
                                </span>
                              </div>
                            </div>

                            <div className="pt-2 border-t flex justify-between font-medium">
                              <span>Total:</span>
                              <span>{formatCurrency(item.total)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 w-full sm:max-w-md sm:ml-auto">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>{formatCurrency(purchaseOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax:</span>
                    <span>{formatCurrency(purchaseOrder.tax_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount:</span>
                    <span>-{formatCurrency(purchaseOrder.discount_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span>{formatCurrency(purchaseOrder.shipping_cost)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(purchaseOrder.total_amount)}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-muted-foreground">Amount Paid:</span>
                    <span>{formatCurrency(purchaseOrder.amount_paid)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-primary">
                    <span>Balance Due:</span>
                    <span>{formatCurrency(purchaseOrder.balance_due)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment History Card */}
            {payments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Payments made against this purchase order</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Desktop Table View (hidden on mobile) */}
                  <div className="hidden md:block rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Payment #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="w-[100px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.payment_number}</TableCell>
                            <TableCell>{formatDate(payment.payment_date)}</TableCell>
                            <TableCell>{getPaymentMethodBadge(payment.payment_method)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={payment.status === "completed" ? "outline" : "secondary"}
                                className={
                                  payment.status === "completed" ? "bg-green-50 text-green-700 border-green-200" : ""
                                }
                              >
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(payment.amount_paid)}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" asChild>
                                <a href={`/payments/${payment.id}`}>
                                  <FileText className="mr-1 h-3 w-3" />
                                  View
                                </a>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View (hidden on desktop) */}
                  <div className="md:hidden space-y-4">
                    {payments.map((payment) => (
                      <div key={payment.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium">{payment.payment_number}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(payment.payment_date)}</div>
                          </div>
                          <div>{getPaymentMethodBadge(payment.payment_method)}</div>
                        </div>

                        <div className="flex justify-between items-center mb-3">
                          <Badge
                            variant={payment.status === "completed" ? "outline" : "secondary"}
                            className={
                              payment.status === "completed" ? "bg-green-50 text-green-700 border-green-200" : ""
                            }
                          >
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                          <div className="font-medium">{formatCurrency(payment.amount_paid)}</div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <a href={`/payments/${payment.id}`}>
                            <FileText className="mr-1 h-4 w-4" />
                            View Receipt
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Purchase Orders
              </Button>
              <Button variant="outline" asChild>
                <a href={`/purchase-orders/${purchaseOrder.id}/edit`}>Edit Purchase Order</a>
              </Button>
              {purchaseOrder.payment_status !== "paid" && (
                <Button asChild>
                  <a href={`/payments/create/${purchaseOrder.id}`}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Make Payment
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  )
}

