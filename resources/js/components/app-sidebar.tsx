import { NavFooter } from "@/components/nav-footer"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { NavItem } from "@/types"
import { Link } from "@inertiajs/react"
import {
  LayoutGrid,
  Package,
  Users,
  ShoppingCart,
  CreditCard,
  FileText,
  List,
  PlusCircle,
  AlertTriangle,
  FileDown,
  FileUp,
} from "lucide-react"
import AppLogo from "./app-logo"

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Inventory Management",
    url: "/inventory",
    icon: Package,
    
    },
  {
    title: "Customer Management",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Sales & Order Management",
    url: "/purchase-orders",
    icon: ShoppingCart,
  },
  {
    title: "Payment & Transaction",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: "Reports",
    url: "",
    icon: FileText,
  },
  {
    title: "User Management",
    url: "",
    icon: Users,
  },
]

const footerNavItems: NavItem[] = []

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

