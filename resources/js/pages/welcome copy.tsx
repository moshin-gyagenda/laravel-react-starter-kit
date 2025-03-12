"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight, BarChart3, Package, Shield, ArrowRight } from "lucide-react"

// Modern AppLogo component
const AppLogo = () => (
  <div className="flex items-center gap-2">
    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
      Z
    </div>
    <span className="font-semibold text-xl">Zupa</span>
  </div>
)

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <AppLogo />
          <div className="flex items-center gap-4">
            <a
              href="/login"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Log in
            </a>
            <Button asChild variant="outline" className="rounded-full">
              <a href="/register">Register</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Streamline Your <span className="text-indigo-600 dark:text-indigo-400">Financial Operations</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Zupa Distributors AFMS helps you manage your finances, track inventory, and optimize your distribution
              operations all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="rounded-full">
                <a href="/dashboard">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <a href="/demo">Watch Demo</a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square md:aspect-auto md:h-[450px] bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
              <div className="absolute inset-0 bg-white/50 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Financial Dashboard</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                      <div className="h-24 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-md mb-2"></div>
                      <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                      <div className="h-24 bg-purple-500/20 dark:bg-purple-500/10 rounded-md mb-2"></div>
                      <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                      <div className="h-24 bg-blue-500/20 dark:bg-blue-500/10 rounded-md mb-2"></div>
                      <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                      <div className="h-24 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-md mb-2"></div>
                      <div className="h-3 w-3/5 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Our platform provides everything you need to manage your distribution business efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6">
              <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Financial Analytics</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Gain insights into your financial performance with detailed analytics and reporting.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              View Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
              <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Inventory Management</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Track your inventory in real-time and optimize stock levels to meet demand.
            </p>
            <a
              href="/inventory"
              className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300"
            >
              Check Inventory
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure Transactions</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Process payments and manage transactions with enterprise-grade security.
            </p>
            <a
              href="/transactions"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
            >
              View Transactions
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-indigo-100 mb-8">
              Join thousands of distributors who have streamlined their operations with Zupa AFMS.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="rounded-full">
                <a href="/register">Create Account</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 rounded-full"
              >
                <a href="/contact">Contact Sales</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <AppLogo />
            <div className="mt-6 md:mt-0">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                © {new Date().getFullYear()} Zupa Distributors. All rights reserved.
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex gap-6">
              <a
                href="/terms"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Terms
              </a>
              <a
                href="/privacy"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Privacy
              </a>
              <a
                href="/support"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

