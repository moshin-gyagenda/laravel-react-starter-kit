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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Save, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import TopNav from "@/components/top-nav"

interface PageProps {
  auth: {
    user: User
  }
  [key: string]: any
}

interface PurchaseOrderFormData {
  po_number: string
  customer_id: string
  order_date: string
  payment_terms: string
  payment_status: string
  subtotal: number
  tax_amount: number
  shipping_cost: number
  discount_amount: number
  total_amount: number
  balance_due: number
  items: PurchaseOrderItem[]
  [key: string]: string | number | PurchaseOrderItem[]
}

interface PurchaseOrderItem {
  id?: number
  inventory_id: string
  quantity: number
  unit: string
  unit_price: number
  tax_rate: number
  tax_amount: number
  discount_rate: number
  discount_amount: number
  subtotal: number
  total: number
  inventory_name?: string
  [key: string]: string | number | undefined
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

interface Inventory {
  id: number
  name: string
  packaging_type: string
  selling_price: number
  cost_price: number
  quantity: number
  status: string
}

interface PurchaseOrder {
  id: number
  po_number: string
  customer_id: number
  order_date: string
  payment_terms: string
  payment_status: string
  subtotal: number
  tax_amount: number
  shipping_cost: number
  discount_amount: number
  total_amount: number
  amount_paid: number
  balance_due: number
  customer: Customer
  items: PurchaseOrderItem[]
}

interface EditPurchaseOrderProps {
  purchaseOrder: PurchaseOrder
  customers: Customer[]
  inventories: Inventory[]
}

export default function EditPurchaseOrder({ purchaseOrder, customers, inventories }: EditPurchaseOrderProps) {
  const { auth } = usePage<PageProps>().props
  const [items, setItems] = useState<PurchaseOrderItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  // Initialize form with existing purchase order data
  const { data, setData, put, processing, errors } = useForm<PurchaseOrderFormData>({
    po_number: purchaseOrder.po_number,
    customer_id: purchaseOrder.customer_id.toString(),
    order_date: purchaseOrder.order_date,
    payment_terms: purchaseOrder.payment_terms,
    payment_status: purchaseOrder.payment_status,
    subtotal: purchaseOrder.subtotal,
    tax_amount: purchaseOrder.tax_amount,
    shipping_cost: purchaseOrder.shipping_cost,
    discount_amount: purchaseOrder.discount_amount,
    total_amount: purchaseOrder.total_amount,
    balance_due: purchaseOrder.balance_due,
    items: [],
  })

  // Initialize items state with existing purchase order items
  useEffect(() => {
    if (purchaseOrder.items && purchaseOrder.items.length > 0) {
      // Map the items to ensure they have the correct format
      const formattedItems = purchaseOrder.items.map((item) => ({
        ...item,
        inventory_id: item.inventory_id.toString(),
        inventory_name: inventories.find((inv) => inv.id === Number(item.inventory_id))?.name,
      }))
      setItems(formattedItems)
    }
  }, [purchaseOrder.items, inventories])

  // Set the selected customer based on the purchase order
  useEffect(() => {
    setSelectedCustomer(purchaseOrder.customer)
  }, [purchaseOrder.customer])

  // Update selected customer when customer_id changes
  useEffect(() => {
    if (data.customer_id) {
      const customer = customers.find((c) => c.id.toString() === data.customer_id.toString())
      setSelectedCustomer(customer || null)
    } else {
      setSelectedCustomer(null)
    }
  }, [data.customer_id, customers])

  // Recalculate totals whenever items or shipping cost changes
  useEffect(() => {
    calculateTotals(items)
  }, [items, data.shipping_cost])

  // Update items in form data whenever items state changes
  useEffect(() => {
    setData("items", items)
  }, [items])

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Purchase Orders",
      href: "/purchase-orders",
    },
    {
      title: purchaseOrder.po_number,
      href: `/purchase-orders/${purchaseOrder.id}/show`,
    },
    {
      title: "Edit",
      href: `/purchase-orders/${purchaseOrder.id}/edit`,
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Make sure items are set in the form data before submission
    setData("items", items)

    // Log what's being submitted for debugging
    console.log("Submitting data:", data)

    // Use the put method to update the purchase order
    put(`/purchase-orders/${purchaseOrder.id}/update`)
  }

  const addItem = () => {
    const newItem: PurchaseOrderItem = {
      inventory_id: "",
      quantity: 1,
      unit: "",
      unit_price: 0,
      tax_rate: 0,
      tax_amount: 0,
      discount_rate: 0,
      discount_amount: 0,
      subtotal: 0,
      total: 0,
    }
    const newItems = [...items, newItem]
    setItems(newItems)
    // Auto-expand the newly added item on mobile
    setExpandedItems([...expandedItems, newItems.length - 1])
  }

  const removeItem = (index: number) => {
    const updatedItems = [...items]
    updatedItems.splice(index, 1)
    setItems(updatedItems)
    // Remove from expanded items
    setExpandedItems(expandedItems.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)))
  }

  const toggleItemExpand = (index: number) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((i) => i !== index))
    } else {
      setExpandedItems([...expandedItems, index])
    }
  }

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: string | number) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // If inventory_id changed, update related fields
    if (field === "inventory_id" && typeof value === "string") {
      const inventory = inventories.find((inv) => inv.id.toString() === value)
      if (inventory) {
        updatedItems[index].unit = inventory.packaging_type || "pcs"
        updatedItems[index].unit_price = inventory.selling_price
        updatedItems[index].inventory_name = inventory.name
      }
    }

    // Recalculate item totals
    const item = updatedItems[index]
    const quantity = Number(item.quantity)
    const unitPrice = Number(item.unit_price)
    const taxRate = Number(item.tax_rate)
    const discountRate = Number(item.discount_rate)

    item.subtotal = quantity * unitPrice
    item.tax_amount = item.subtotal * (taxRate / 100)
    item.discount_amount = item.subtotal * (discountRate / 100)
    item.total = item.subtotal + item.tax_amount - item.discount_amount

    setItems(updatedItems)
  }

  const calculateTotals = (currentItems: PurchaseOrderItem[]) => {
    const subtotal = currentItems.reduce((sum, item) => sum + Number(item.subtotal), 0)
    const taxAmount = currentItems.reduce((sum, item) => sum + Number(item.tax_amount), 0)
    const discountAmount = currentItems.reduce((sum, item) => sum + Number(item.discount_amount), 0)
    const shippingCost = Number(data.shipping_cost) || 0
    const totalAmount = subtotal + taxAmount - discountAmount + shippingCost

    // For edit, we need to consider the amount already paid
    const amountPaid = purchaseOrder.amount_paid || 0
    const balanceDue = Math.max(0, totalAmount - amountPaid)

    setData({
      ...data,
      subtotal,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      balance_due: balanceDue,
      items: currentItems,
    })
  }

  const getInventoryName = (inventoryId: string) => {
    const inventory = inventories.find((inv) => inv.id.toString() === inventoryId)
    return inventory ? inventory.name : "Select item"
  }

  const paymentStatusOptions = ["unpaid", "partially_paid", "paid"]
  const paymentTermsOptions = ["Due on Receipt", "COD"]

  return (
    <>
      <TopNav user={auth.user} />
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={`Edit Purchase Order: ${purchaseOrder.po_number}`} />

        <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl font-bold">Edit Purchase Order: {purchaseOrder.po_number}</h1>
            <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Purchase Order
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* Customer Selection Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                  <CardDescription>Select a customer for this purchase order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="customer_id">
                      Customer <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={data.customer_id.toString()}
                      onValueChange={(value) => setData("customer_id", value)}
                    >
                      <SelectTrigger id="customer_id">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.company_name
                              ? `${customer.company_name}`
                              : `${customer.first_name} ${customer.last_name}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.customer_id && <p className="text-sm text-destructive">{errors.customer_id}</p>}
                  </div>

                  {selectedCustomer && (
                    <div className="p-4 border rounded-md bg-muted/30">
                      <h4 className="font-medium mb-2">Customer Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground block">Name:</span>
                          <span className="font-medium">
                            {selectedCustomer.company_name
                              ? selectedCustomer.company_name
                              : `${selectedCustomer.first_name} ${selectedCustomer.last_name}`}
                          </span>
                        </div>
                        {selectedCustomer.email && (
                          <div>
                            <span className="text-muted-foreground block">Email:</span>
                            <span className="break-words">{selectedCustomer.email}</span>
                          </div>
                        )}
                        {selectedCustomer.phone && (
                          <div>
                            <span className="text-muted-foreground block">Phone:</span>
                            <span>{selectedCustomer.phone}</span>
                          </div>
                        )}
                        {selectedCustomer.location && (
                          <div>
                            <span className="text-muted-foreground block">Location:</span>
                            <span>{selectedCustomer.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>Edit the basic information for this purchase order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Column 1 - Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>

                      <div className="space-y-2">
                        <Label htmlFor="po_number">
                          PO Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="po_number"
                          value={data.po_number}
                          onChange={(e) => setData("po_number", e.target.value)}
                          placeholder="Enter PO number"
                          required
                        />
                        {errors.po_number && <p className="text-sm text-destructive">{errors.po_number}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="order_date">
                          Order Date <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="order_date"
                          type="date"
                          value={data.order_date}
                          onChange={(e) => setData("order_date", e.target.value)}
                          required
                        />
                        {errors.order_date && <p className="text-sm text-destructive">{errors.order_date}</p>}
                      </div>
                    </div>

                    {/* Column 2 - Payment Information */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Payment Information</h3>

                      <div className="space-y-2">
                        <Label htmlFor="payment_terms">Payment Terms</Label>
                        <Select value={data.payment_terms} onValueChange={(value) => setData("payment_terms", value)}>
                          <SelectTrigger id="payment_terms">
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentTermsOptions.map((term) => (
                              <SelectItem key={term} value={term}>
                                {term}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.payment_terms && <p className="text-sm text-destructive">{errors.payment_terms}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="payment_status">Payment Status</Label>
                        <Select value={data.payment_status} onValueChange={(value) => setData("payment_status", value)}>
                          <SelectTrigger id="payment_status">
                            <SelectValue placeholder="Select payment status" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentStatusOptions.map((status) => (
                              <SelectItem key={status} value={status} className="capitalize">
                                {status.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.payment_status && <p className="text-sm text-destructive">{errors.payment_status}</p>}
                      </div>
                    </div>

                    {/* Column 3 - Additional Costs */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Additional Costs</h3>

                      <div className="space-y-2">
                        <Label htmlFor="shipping_cost">Shipping Cost</Label>
                        <Input
                          id="shipping_cost"
                          type="number"
                          min="0"
                          step="0.01"
                          value={data.shipping_cost}
                          onChange={(e) => setData("shipping_cost", Number.parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                        {errors.shipping_cost && <p className="text-sm text-destructive">{errors.shipping_cost}</p>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Order Items</CardTitle>
                    <CardDescription>Edit items in this purchase order</CardDescription>
                  </div>
                  <Button type="button" onClick={addItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Add Item</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
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
                          <TableHead>Tax %</TableHead>
                          <TableHead>Discount %</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                              No items added. Click "Add Item" to add your first item.
                            </TableCell>
                          </TableRow>
                        ) : (
                          items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Select
                                  value={item.inventory_id.toString()}
                                  onValueChange={(value) => updateItem(index, "inventory_id", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select item" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {inventories.map((inventory) => (
                                      <SelectItem key={inventory.id} value={inventory.id.toString()}>
                                        <div className="flex items-center justify-between w-full">
                                          <span>{inventory.name}</span>
                                          <Badge
                                            variant={inventory.quantity > 0 ? "outline" : "destructive"}
                                            className="ml-2"
                                          >
                                            {inventory.quantity > 0 ? `Stock: ${inventory.quantity}` : "Out of stock"}
                                          </Badge>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0.01"
                                  step="0.01"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateItem(index, "quantity", Number.parseFloat(e.target.value) || 0)
                                  }
                                  className="w-20"
                                />
                              </TableCell>
                              <TableCell>
                                <Input value={item.unit} readOnly className="w-20 bg-muted/50" />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.unit_price}
                                  onChange={(e) =>
                                    updateItem(index, "unit_price", Number.parseFloat(e.target.value) || 0)
                                  }
                                  className="w-24"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  value={item.tax_rate}
                                  onChange={(e) =>
                                    updateItem(index, "tax_rate", Number.parseFloat(e.target.value) || 0)
                                  }
                                  className="w-16"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  value={item.discount_rate}
                                  onChange={(e) =>
                                    updateItem(index, "discount_rate", Number.parseFloat(e.target.value) || 0)
                                  }
                                  className="w-16"
                                />
                              </TableCell>
                              <TableCell className="text-right">{item.subtotal.toFixed(2)}</TableCell>
                              <TableCell className="text-right">{item.total.toFixed(2)}</TableCell>
                              <TableCell>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View (hidden on desktop) */}
                  <div className="md:hidden space-y-4">
                    {items.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground border rounded-md p-4">
                        No items added. Click "Add" to add your first item.
                      </div>
                    ) : (
                      items.map((item, index) => (
                        <div key={index} className="border rounded-md overflow-hidden">
                          <div
                            className="flex items-center justify-between p-3 bg-muted/30 cursor-pointer"
                            onClick={() => toggleItemExpand(index)}
                          >
                            <div className="font-medium">
                              {item.inventory_id ? getInventoryName(item.inventory_id) : `Item #${index + 1}`}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium">{item.total.toFixed(2)}</div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeItem(index)
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                              {expandedItems.includes(index) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </div>
                          </div>

                          {expandedItems.includes(index) && (
                            <div className="p-3 space-y-3 border-t">
                              <div className="space-y-2">
                                <Label>Item</Label>
                                <Select
                                  value={item.inventory_id.toString()}
                                  onValueChange={(value) => updateItem(index, "inventory_id", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select item" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {inventories.map((inventory) => (
                                      <SelectItem key={inventory.id} value={inventory.id.toString()}>
                                        <div className="flex items-center justify-between w-full">
                                          <span>{inventory.name}</span>
                                          <Badge
                                            variant={inventory.quantity > 0 ? "outline" : "destructive"}
                                            className="ml-2"
                                          >
                                            {inventory.quantity > 0 ? `Stock: ${inventory.quantity}` : "Out of stock"}
                                          </Badge>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <Label>Quantity</Label>
                                  <Input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      updateItem(index, "quantity", Number.parseFloat(e.target.value) || 0)
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Unit</Label>
                                  <Input value={item.unit} readOnly className="bg-muted/50" />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <Label>Unit Price</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.unit_price}
                                    onChange={(e) =>
                                      updateItem(index, "unit_price", Number.parseFloat(e.target.value) || 0)
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Subtotal</Label>
                                  <div className="h-10 px-3 py-2 rounded-md border bg-muted/50 flex items-center">
                                    {item.subtotal.toFixed(2)}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <Label>Tax %</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={item.tax_rate}
                                    onChange={(e) =>
                                      updateItem(index, "tax_rate", Number.parseFloat(e.target.value) || 0)
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Discount %</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={item.discount_rate}
                                    onChange={(e) =>
                                      updateItem(index, "discount_rate", Number.parseFloat(e.target.value) || 0)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="pt-2 border-t flex justify-between font-medium">
                                <span>Total:</span>
                                <span>{item.total.toFixed(2)}</span>
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
                      <span>{data.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax:</span>
                      <span>{data.tax_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount:</span>
                      <span>-{data.discount_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping:</span>
                      <span>{data.shipping_cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total Amount:</span>
                      <span>{data.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-muted-foreground">Amount Paid:</span>
                      <span>{purchaseOrder.amount_paid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-primary">
                      <span>Balance Due:</span>
                      <span>{data.balance_due.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => window.history.back()}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={processing || items.length === 0}
                    className="w-full sm:w-auto order-1 sm:order-2"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Update Purchase Order
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </div>
      </AppLayout>
    </>
  )
}

