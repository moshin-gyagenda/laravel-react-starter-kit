"use client"
import { useState } from "react"
import { Bell, Search, User, Settings, LogOut, ChevronDown, ShoppingCart, Users, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import AppLogo from "./app-logo"

// Navigation items for sidebar
const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "home" },
  { name: "Purchase Orders", href: "/purchase-orders", icon: "shopping-cart" },
  { name: "Customers", href: "/customers", icon: "users" },
  { name: "Payments", href: "/payments", icon: "credit-card" },
  { name: "Inventory", href: "/inventory", icon: "package" },
  { name: "Reports", href: "/reports", icon: "bar-chart-2" },
  { name: "Settings", href: "/settings", icon: "settings" },
]

interface User {
    name: string;
    role: string;
    avatar?: string;
}

interface TopNavProps {
    user: User;
}

export default function TopNav( { user }: TopNavProps ) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
             <div className="flex h-full flex-col">
              <div className="flex h-14 items-center border-b px-4">
                <div className="flex items-center gap-2">
                  <AppLogo />
                </div>
                <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 overflow-auto py-4">
                <div className="px-4 py-2">
                  <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Main Navigation
                  </h2>
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                          item.href === window.location.pathname
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        {item.icon === "home" && <ShoppingCart className="h-4 w-4" />}
                        {item.icon === "shopping-cart" && <ShoppingCart className="h-4 w-4" />}
                        {item.icon === "users" && <Users className="h-4 w-4" />}
                        {item.icon === "credit-card" && <ShoppingCart className="h-4 w-4" />}
                        {item.icon === "package" && <ShoppingCart className="h-4 w-4" />}
                        {item.icon === "bar-chart-2" && <ShoppingCart className="h-4 w-4" />}
                        {item.icon === "settings" && <Settings className="h-4 w-4" />}
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </nav>
              <div className="border-t p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">Administrator</p>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex items-center">
          <a href="/dashboard" className="flex items-center gap-2">
            <AppLogo />
          </a>
        </div>
      </div>

      {/* Search Bar */}
      <div className="hidden flex-1 max-w-md px-8 md:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full appearance-none bg-background pl-8 shadow-none"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex flex-col gap-2 p-2">
              <div className="flex items-start gap-2 rounded-lg p-2 hover:bg-muted">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShoppingCart className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">New order received</span>
                  <span className="text-xs text-muted-foreground">PO-2023-0042 from Acme Corporation</span>
                  <span className="mt-1 text-xs text-muted-foreground">2 hours ago</span>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg p-2 hover:bg-muted">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <ShoppingCart className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Payment received</span>
                  <span className="text-xs text-muted-foreground">UGX 8,750 from TechSolutions Inc</span>
                  <span className="mt-1 text-xs text-muted-foreground">5 hours ago</span>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg p-2 hover:bg-muted">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                  <Users className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">New customer registered</span>
                  <span className="text-xs text-muted-foreground">Strategic Partners Ltd.</span>
                  <span className="mt-1 text-xs text-muted-foreground">1 day ago</span>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="outline" size="sm" className="w-full">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>System Setup</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              User Management
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Order Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              System Configuration
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                              <span className="text-sm font-medium">{user.name }</span>
                <span className="text-xs text-muted-foreground">Administrator</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

