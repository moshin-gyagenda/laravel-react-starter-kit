"use client"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, User } from "@/types"
import { Head, router, usePage } from "@inertiajs/react"
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
import TopNav from "@/components/top-nav"

interface PageProps {
  auth: {
    user: User
  }
  [key: string]: any
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Inventory",
    href: "/inventory",
  },
]

interface Inventory {
  id: number
  name: string
  description: string | null
  packaging_type: string | null
  quantity: number
  cost_price: number | null
  selling_price: number | null
  discount_price: number | null
  manufacturer: string | null
}

interface Props {
  inventories?: Inventory[]
}

export default function Inventory({ inventories = [] }: Props) {
  const { auth } = usePage<PageProps>().props
  const [searchTerm, setSearchTerm] = useState("")

  const filteredInventories = inventories.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.packaging_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "—"
    return `UGX ${amount.toLocaleString()}`
  }

  return (
    <>
      <TopNav user={auth.user} />
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Inventory" />

        <div className="container mx-auto py-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl font-bold">Inventory Management</h1>
            <Button asChild>
              <a href="/inventory/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </a>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Inventory Items</CardTitle>
                  <CardDescription>Manage your inventory items here</CardDescription>
                </div>
                <div className="w-full sm:w-64">
                  <Input
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {inventories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <PlaceholderPattern className="h-48 w-48 /30" />
                  <h3 className="mt-4 text-md font-medium">No inventory items</h3>
                  <p className="mt-2 text-center max-w-sm">
                    You don't have any inventory items yet. Add your first item to get started.
                  </p>
                  <Button asChild className="mt-4">
                    <a href="/inventory/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Item
                    </a>
                  </Button>
                </div>
              ) : filteredInventories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <h3 className="mt-4 text-md font-medium">No matching items</h3>
                  <p className="mt-2 text-center max-w-sm">No inventory items match your search criteria.</p>
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
                        <th className="py-3 px-4 text-left font-medium hidden md:table-cell text-sm">Packaging Type</th>
                        <th className="py-3 px-4 text-right font-medium text-sm">Quantity</th>
                        <th className="py-3 px-4 text-left font-medium hidden lg:table-cell text-sm">Cost Price</th>
                        <th className="py-3 px-4 text-right font-medium text-sm">Selling Price</th>
                        {/* <th className="py-3 px-4 text-left font-medium hidden md:table-cell text-sm">
                          Manufacturer
                        </th> */}
                        <th className="py-3 px-4 w-[80px] text-center text-sm">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredInventories.map((item, index) => (
                        <tr
                          key={item.id}
                          className={`border-b hover:bg-muted/50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-muted/20"
                          }`}
                        >
                          <td className="py-3 px-4 hidden text-sm lg:table-cell">{item.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-sm md:hidden">{item.packaging_type}</div>
                          </td>
                          <td className="py-3 px-4 text-sm hidden md:table-cell">{item.packaging_type || "—"}</td>
                          <td className="py-3 px-4 text-sm text-right">
                            <Badge variant={item.quantity > 10 ? "outline" : "destructive"}>{item.quantity}</Badge>
                          </td>
                          <td className="py-3 px-4 hidden text-sm lg:table-cell">{formatCurrency(item.cost_price)}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex flex-col text-sm items-end">{formatCurrency(item.selling_price)}</div>
                          </td>
                          {/* <td className="py-3 px-4 hidden md:table-cell">{item.manufacturer || "—"}</td> */}
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
                                  <a href={`/inventory/${item.id}/edit`} className="flex items-center cursor-pointer">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <a
                                    href={`/inventory/${item.id}`}
                                    className="flex items-center text-destructive cursor-pointer"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      if (confirm("Are you sure you want to delete this item?")) {
                                        // Using Inertia to handle the delete request
                                        router.delete(`/inventory/${item.id}`)
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
    </>
  )
}

