import { Head, usePage } from "@inertiajs/react"

import AppearanceTabs from "@/components/appearance-tabs"
import HeadingSmall from "@/components/heading-small"
import TopNav from "@/components/top-nav"
import type { BreadcrumbItem, SharedData } from "@/types"

import AppLayout from "@/layouts/app-layout"
import SettingsLayout from "@/layouts/settings/layout"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Appearance settings",
    href: "/settings/appearance",
  },
]

export default function Appearance() {
  const { auth } = usePage<SharedData>().props

  return (
    <>
      <TopNav user={auth.user} />
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Appearance settings" />

        <SettingsLayout>
          <div className="space-y-6">
            <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
            <AppearanceTabs />
          </div>
        </SettingsLayout>
      </AppLayout>
    </>
  )
}

