"use client"
import { useState } from "react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, User } from "@/types"
import { Head, usePage } from "@inertiajs/react"
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TopNav from "@/components/top-nav"

interface PageProps {
  auth: {
    user: User
  }
  [key: string]: any
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
]

// Sample data for the dashboard
const recentOrders = [
  { id: "PO-2023-0042", customer: "Acme Corporation", amount: 12500, date: "2023-03-15", status: "paid" },
  { id: "PO-2023-0041", customer: "TechSolutions Inc", amount: 8750, date: "2023-03-14", status: "pending" },
  { id: "PO-2023-0040", customer: "Global Enterprises", amount: 5200, date: "2023-03-12", status: "partially_paid" },
  { id: "PO-2023-0039", customer: "Innovative Systems", amount: 3800, date: "2023-03-10", status: "paid" },
  { id: "PO-2023-0038", customer: "Strategic Partners", amount: 9300, date: "2023-03-08", status: "pending" },
]

const topCustomers = [
  { name: "Acme Corporation", orders: 32, spent: 145000 },
  { name: "TechSolutions Inc", orders: 28, spent: 98500 },
  { name: "Global Enterprises", orders: 24, spent: 87200 },
  { name: "Innovative Systems", orders: 18, spent: 65800 },
]

const monthlySales = [
  { month: "Jan", amount: 42000 },
  { month: "Feb", amount: 38000 },
  { month: "Mar", amount: 55000 },
  { month: "Apr", amount: 48000 },
  { month: "May", amount: 62000 },
  { month: "Jun", amount: 58000 },
  { month: "Jul", amount: 70000 },
  { month: "Aug", amount: 75000 },
  { month: "Sep", amount: 80000 },
  { month: "Oct", amount: 92000 },
  { month: "Nov", amount: 85000 },
  { month: "Dec", amount: 110000 },
]

const salesByCategory = [
  { category: "Electronics", percentage: 35 },
  { category: "Furniture", percentage: 25 },
  { category: "Office Supplies", percentage: 20 },
  { category: "Services", percentage: 15 },
  { category: "Other", percentage: 5 },
]

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("this-month")
  const { auth } = usePage<PageProps>().props

  return (
    <>
      <TopNav user={auth.user} />
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard" />

        <div className="flex flex-col gap-6 p-4 md:p-6">
          {/* Dashboard Header with Time Range Selector */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">UGX 845,000</div>
                <div className="flex items-center pt-1 text-xs text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  <span>12.5% from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <div className="flex items-center pt-1 text-xs text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  <span>8.2% from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <div className="flex items-center pt-1 text-xs text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  <span>5.3% from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">UGX 20,119</div>
                <div className="flex items-center pt-1 text-xs text-red-500">
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                  <span>3.1% from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
                <CardDescription>Sales revenue over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                  <div className="flex h-full items-end gap-2 pb-6">
                    {monthlySales.map((month, i) => (
                      <div key={i} className="relative flex w-full flex-col items-center">
                        <div
                          className="w-full rounded-md bg-primary"
                          style={{
                            height: `${(month.amount / 110000) * 100}%`,
                            opacity: month.month === "Oct" ? 1 : 0.7,
                          }}
                        ></div>
                        <span className="absolute -bottom-6 text-xs text-muted-foreground">{month.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesByCategory.map((category, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{category.category}</span>
                        <span className="font-medium">{category.percentage}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary" style={{ width: `${category.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders and Top Customers */}
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-7 md:col-span-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest purchase orders from customers</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-1">
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">UGX {order.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            order.status === "paid"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : order.status === "pending"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                          }
                        >
                          {order.status === "paid" ? "Paid" : order.status === "pending" ? "Pending" : "Partial"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-7 md:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Top Customers</CardTitle>
                  <CardDescription>Customers with highest purchase value</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCustomers.map((customer, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">UGX {customer.spent.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Activities */}
          <Card className="col-span-7">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Activities</CardTitle>
                <CardDescription>Scheduled tasks and reminders</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Customer Meeting</p>
                    <p className="text-sm text-muted-foreground">Meeting with Acme Corporation to discuss new order</p>
                    <p className="mt-2 text-xs font-medium text-primary">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Order Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Delivery of order PO-2023-0038 to Strategic Partners
                    </p>
                    <p className="mt-2 text-xs font-medium text-primary">March 20, 2023</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Payment Due</p>
                    <p className="text-sm text-muted-foreground">
                      Payment due for order PO-2023-0041 from TechSolutions Inc
                    </p>
                    <p className="mt-2 text-xs font-medium text-primary">March 21, 2023</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </>
  )
}

