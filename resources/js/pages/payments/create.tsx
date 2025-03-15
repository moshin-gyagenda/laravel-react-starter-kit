"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Head, useForm, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, User } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, DollarSign, Receipt, Save, Clock, Calendar } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import TopNav from "@/components/top-nav"

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
  {
    title: "Record Payment",
    href: "/payments/create",
  },
]

interface Customer {
  id: number
  first_name: string
  last_name: string
  company_name: string | null
}

interface PurchaseOrder {
  id: number
  po_number: string
  customer_id: number
  order_date: string
  total_amount: number
  payment_status: "unpaid" | "partially_paid" | "paid"
  amount_paid: number
  balance_due: number
  customer: Customer
}

interface Payment {
  id: number
  purchase_order_id: number
  payment_number: string
  amount_paid: number
  payment_date: string
  payment_method: string
  reference_number: string | null
  transaction_id: string | null
  payment_provider: string | null
  notes: string | null
  status: string
  created_at: string
}

interface PaymentFormData {
  purchase_order_id: string
  customer_id: string
  amount_paid: string
  payment_date: string
  payment_method: string
  reference_number: string
  transaction_id: string
  payment_provider: string
  notes: string
  [key: string]: string
}

interface CreatePaymentProps {
  purchaseOrders: PurchaseOrder[]
  selectedOrder?: PurchaseOrder
  paymentHistory?: Payment[]
}

export default function CreatePayment({ purchaseOrders, selectedOrder, paymentHistory = [] }: CreatePaymentProps) {
  const { auth } = usePage<PageProps>().props
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(selectedOrder || null)

  const { data, setData, post, processing, errors } = useForm<PaymentFormData>({
    purchase_order_id: selectedOrder ? String(selectedOrder.id) : "",
    customer_id: selectedOrder ? String(selectedOrder.customer_id) : "",
    amount_paid: selectedOrder ? String(selectedOrder.balance_due) : "",
    payment_date: new Date().toISOString().split("T")[0],
    payment_method: "cash",
    reference_number: "",
    transaction_id: "",
    payment_provider: "",
    notes: "",
  })

  useEffect(() => {
    if (selectedOrder) {
      // If we navigated directly to a specific purchase order
      setSelectedPurchaseOrder(selectedOrder)
      setData("purchase_order_id", String(selectedOrder.id))
      setData("customer_id", String(selectedOrder.customer_id))
      setData("amount_paid", String(selectedOrder.balance_due))
    } else if (data.purchase_order_id) {
      // If a purchase order was selected from the dropdown
      const order = purchaseOrders.find((o) => o.id === Number.parseInt(data.purchase_order_id))
      if (order) {
        setSelectedPurchaseOrder(order)
        setData("customer_id", String(order.customer_id))
        setData("amount_paid", String(order.balance_due))
      }
    }
  }, [data.purchase_order_id, purchaseOrders, selectedOrder])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post("/payments/store")
  }

  const formatCurrency = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
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

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "check", label: "Check" },
    { value: "credit_card", label: "Credit Card" },
    { value: "mobile_money", label: "Mobile Money" },
    { value: "other", label: "Other" },
  ]

  return (
    <>
      <TopNav user={auth.user} />
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Record Payment" />

        <div className="container mx-auto py-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl font-bold">
              {selectedOrder ? `Record Payment for ${selectedOrder.po_number}` : "Record Payment"}
            </h1>
            <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Payments
            </Button>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            {/* Left column - Order details and payment history */}
            <div>
              {selectedPurchaseOrder && (
                <>
                  <Card className="mb-6">
                    <CardHeader className="pb-3">
                      <CardTitle>Order Summary</CardTitle>
                      <CardDescription>Purchase order details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">PO Number:</div>
                          <div className="font-medium">{selectedPurchaseOrder.po_number}</div>

                          <div className="text-muted-foreground">Date:</div>
                          <div>{new Date(selectedPurchaseOrder.order_date).toLocaleDateString()}</div>

                          <div className="text-muted-foreground">Status:</div>
                          <div className="capitalize">{selectedPurchaseOrder.payment_status.replace("_", " ")}</div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Customer</h3>
                        <div className="text-sm">
                          <div className="font-medium">
                            {selectedPurchaseOrder.customer.first_name} {selectedPurchaseOrder.customer.last_name}
                          </div>
                          {selectedPurchaseOrder.customer.company_name && (
                            <div className="text-muted-foreground">{selectedPurchaseOrder.customer.company_name}</div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Summary</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Total Amount:</div>
                          <div className="font-medium">{formatCurrency(selectedPurchaseOrder.total_amount)}</div>

                          <div className="text-muted-foreground">Amount Paid:</div>
                          <div>{formatCurrency(selectedPurchaseOrder.amount_paid)}</div>

                          <div className="text-muted-foreground">Balance Due:</div>
                          <div className="font-medium text-primary">
                            {formatCurrency(selectedPurchaseOrder.balance_due)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <a href={`/purchase-orders/${selectedPurchaseOrder.id}`}>
                          <Receipt className="mr-2 h-4 w-4" />
                          View Full Order
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Payment History</CardTitle>
                      <CardDescription>Previous payments for this order</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {paymentHistory && paymentHistory.length > 0 ? (
                        <div className="space-y-4">
                          {paymentHistory.map((payment) => (
                            <div key={payment.id} className="border rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-medium">{payment.payment_number}</div>
                                {getPaymentMethodBadge(payment.payment_method)}
                              </div>
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm mb-2">
                                <div className="text-muted-foreground flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Date:
                                </div>
                                <div>{formatDate(payment.payment_date)}</div>

                                <div className="text-muted-foreground">Amount:</div>
                                <div className="font-medium">{formatCurrency(payment.amount_paid)}</div>

                                {payment.reference_number && (
                                  <>
                                    <div className="text-muted-foreground">Reference:</div>
                                    <div>{payment.reference_number}</div>
                                  </>
                                )}
                              </div>
                              <Button variant="outline" size="sm" className="w-full" asChild>
                                <a href={`/payments/${payment.id}`}>
                                  <Receipt className="mr-1 h-3 w-3" />
                                  View Receipt
                                </a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">No payment history for this order</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Right column - Payment form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>Enter the payment information</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="purchase_order_id">
                          Purchase Order <span className="text-destructive">*</span>
                        </Label>
                        {selectedOrder ? (
                          <Input id="purchase_order_id" value={selectedOrder.po_number} disabled className="bg-muted" />
                        ) : (
                          <Select
                            value={data.purchase_order_id}
                            onValueChange={(value) => setData("purchase_order_id", value)}
                          >
                            <SelectTrigger id="purchase_order_id">
                              <SelectValue placeholder="Select purchase order" />
                            </SelectTrigger>
                            <SelectContent>
                              {purchaseOrders.map((order) => (
                                <SelectItem key={order.id} value={String(order.id)}>
                                  {order.po_number} - {formatCurrency(order.balance_due)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {errors.purchase_order_id && (
                          <p className="text-sm text-destructive">{errors.purchase_order_id}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="payment_date">
                          Payment Date <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="payment_date"
                          type="date"
                          value={data.payment_date}
                          onChange={(e) => setData("payment_date", e.target.value)}
                          required
                        />
                        {errors.payment_date && <p className="text-sm text-destructive">{errors.payment_date}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amount_paid">
                          Amount Paid <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="amount_paid"
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.amount_paid}
                            onChange={(e) => setData("amount_paid", e.target.value)}
                            className="pl-8"
                            required
                          />
                        </div>
                        {errors.amount_paid && <p className="text-sm text-destructive">{errors.amount_paid}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="payment_method">
                          Payment Method <span className="text-destructive">*</span>
                        </Label>
                        <Select value={data.payment_method} onValueChange={(value) => setData("payment_method", value)}>
                          <SelectTrigger id="payment_method">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem key={method.value} value={method.value}>
                                {method.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.payment_method && <p className="text-sm text-destructive">{errors.payment_method}</p>}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Payment Reference</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="reference_number">Reference Number</Label>
                          <Input
                            id="reference_number"
                            value={data.reference_number}
                            onChange={(e) => setData("reference_number", e.target.value)}
                            placeholder="Check number, receipt number, etc."
                          />
                          {errors.reference_number && (
                            <p className="text-sm text-destructive">{errors.reference_number}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="transaction_id">Transaction ID</Label>
                          <Input
                            id="transaction_id"
                            value={data.transaction_id}
                            onChange={(e) => setData("transaction_id", e.target.value)}
                            placeholder="For electronic payments"
                          />
                          {errors.transaction_id && <p className="text-sm text-destructive">{errors.transaction_id}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="payment_provider">Payment Provider</Label>
                          <Input
                            id="payment_provider"
                            value={data.payment_provider}
                            onChange={(e) => setData("payment_provider", e.target.value)}
                            placeholder="Bank name, mobile money provider, etc."
                          />
                          {errors.payment_provider && (
                            <p className="text-sm text-destructive">{errors.payment_provider}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={data.notes}
                        onChange={(e) => setData("notes", e.target.value)}
                        placeholder="Additional information about this payment"
                        rows={3}
                      />
                      {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
                    </div>
                  </CardContent>
                  <CardFooter className="flex mt-8 flex-col sm:flex-row gap-3 sm:justify-between">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => window.history.back()}
                      className="w-full sm:w-auto order-2 sm:order-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={processing} className="w-full sm:w-auto order-1 sm:order-2">
                      <Save className="mr-2 h-4 w-4" />
                      Record Payment
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  )
}

