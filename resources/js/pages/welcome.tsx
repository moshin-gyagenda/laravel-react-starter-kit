"use client"

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  BarChart3,
  Package,
  Shield,
  ArrowRight,
  CheckCircle,
  Users,
  Globe,
  TrendingUp,
  ChevronDown,
} from "lucide-react"

// Modern AppLogo component
const AppLogo = () => (
  <div className="flex items-center gap-2">
    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
      Z
    </div>
    <span className="font-semibold text-xl">Zupa</span>
  </div>
)

// Animated counter component
const AnimatedCounter = ({ value, label, prefix = "", suffix = "" }: { value: number; label: string; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000 // ms
    const steps = 50
    const stepValue = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += stepValue
      if (current > value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-slate-600 dark:text-slate-400 mt-2">{label}</div>
    </div>
  )
}

// Testimonial card component
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
}

const TestimonialCard = ({ quote, author, role, company, image }: TestimonialCardProps) => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-slate-100 dark:border-slate-700">
    <div className="flex items-center gap-4 mb-6">
      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/30">
        {image ? (
          <img src={image || "/placeholder.svg"} alt={author} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl font-bold">
            {author.charAt(0)}
          </div>
        )}
      </div>
      <div>
        <h4 className="font-semibold text-lg">{author}</h4>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          {role}, {company}
        </p>
      </div>
    </div>
    <div className="relative">
      <div className="absolute -top-4 -left-2 text-5xl text-indigo-200 dark:text-indigo-800">"</div>
      <p className="text-slate-700 dark:text-slate-300 relative z-10 italic">{quote}</p>
      <div className="absolute -bottom-8 -right-2 text-5xl text-indigo-200 dark:text-indigo-800">"</div>
    </div>
  </div>
)

// Simple Tabs Component
const SimpleTabs = ({ tabs, defaultTab }: { tabs: any[], defaultTab: string | number }) => {
  const [activeTab, setActiveTab] = useState<string | number>(defaultTab)
  
    return (
      <div className="w-full">
        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8">
          {tabs.map((tab: { id: string | number; label: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm md:text-base transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs.find((tab) => tab.id === activeTab)?.content}</div>
    </div>
  )
}

// Simple Accordion Component
const SimpleAccordion = ({ items }: { items: { question: string; answer: string }[] }) => {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index)
  }

  return (
    <div className="w-full">
      {items.map((item: { question: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; answer: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, index: Key | null | undefined) => (
        <div key={index} className="border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => toggleItem(index as number)}
            className="flex justify-between items-center w-full py-4 text-left font-medium"
          >
            {item.question}
            <ChevronDown
              className={`h-5 w-5 transition-transform ${openItem === index ? "transform rotate-180" : ""}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openItem === index ? "max-h-96 pb-4" : "max-h-0"
            }`}
          >
            <div className="text-slate-600 dark:text-slate-400">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Welcome() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Feature tabs content
  const featureTabs = [
    {
      id: "financial",
      label: "Financial Analytics",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
            <div className="aspect-video bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-8 flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Comprehensive Financial Analytics</h3>
            <ul className="space-y-4">
              {[
                "Real-time financial dashboards with customizable views",
                "Advanced reporting with export capabilities",
                "Trend analysis and forecasting tools",
                "Automated financial reconciliation",
                "Multi-currency support for global operations",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 rounded-full">
              <a href="/financial-analytics">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute -z-10 inset-0 bg-indigo-100 dark:bg-indigo-900/20 rounded-2xl transform rotate-3"></div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold">Revenue Overview</h4>
                <div className="flex gap-2">
                  <div className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    Monthly
                  </div>
                  <div className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-medium">Yearly</div>
                </div>
              </div>
              <div className="h-64 bg-slate-100 dark:bg-slate-700 rounded-lg mb-6 p-4">
                <div className="h-full flex items-end justify-between gap-2">
                  {[40, 65, 45, 80, 75, 90, 60, 80, 95, 75, 70, 85].map((height, i) => (
                    <div key={i} className="w-full h-full flex flex-col justify-end">
                      <div
                        className="w-full bg-indigo-500 dark:bg-indigo-600 rounded-t-sm"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Revenue</div>
                  <div className="text-xl font-semibold">$84.2K</div>
                  <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> +14.2%
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Expenses</div>
                  <div className="text-xl font-semibold">$42.8K</div>
                  <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 transform rotate-180" /> +2.5%
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Profit</div>
                  <div className="text-xl font-semibold">$41.4K</div>
                  <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> +18.7%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "inventory",
      label: "Inventory Management",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 md:order-1">
            <div className="absolute -z-10 inset-0 bg-purple-100 dark:bg-purple-900/20 rounded-2xl transform -rotate-3"></div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold">Inventory Status</h4>
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-xs font-medium text-green-600 dark:text-green-400">
                  Healthy
                </div>
              </div>
              <div className="space-y-4 mb-6">
                {[
                  { name: "Product A", stock: 85, color: "bg-green-500" },
                  { name: "Product B", stock: 62, color: "bg-green-500" },
                  { name: "Product C", stock: 38, color: "bg-yellow-500" },
                  { name: "Product D", stock: 94, color: "bg-green-500" },
                  { name: "Product E", stock: 12, color: "bg-red-500" },
                ].map((product, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{product.name}</span>
                      <span className="font-medium">{product.stock}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${product.color}`} style={{ width: `${product.stock}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="w-full">
                <a href="/inventory">View All Inventory</a>
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Package className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Smart Inventory Management</h3>
              <ul className="space-y-4">
                {[
                  "Real-time inventory tracking across multiple locations",
                  "Automated reordering based on customizable thresholds",
                  "Barcode and QR code scanning capabilities",
                  "Batch tracking and expiration date management",
                  "Detailed inventory history and audit trails",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 rounded-full">
                <a href="/inventory-management">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "security",
      label: "Security & Compliance",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Enterprise-Grade Security</h3>
            <ul className="space-y-4">
              {[
                "End-to-end encryption for all data",
                "Multi-factor authentication and role-based access control",
                "Compliance with industry standards (SOC 2, GDPR, HIPAA)",
                "Regular security audits and penetration testing",
                "Detailed activity logs and anomaly detection",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 rounded-full">
              <a href="/security">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute -z-10 inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-2xl transform rotate-3"></div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold">Security Dashboard</h4>
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-xs font-medium text-green-600 dark:text-green-400">
                  Protected
                </div>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">System Status</div>
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400"></div>
                    Operational
                  </div>
                </div>
                <div className="h-24 bg-slate-200 dark:bg-slate-600 rounded-md flex items-center justify-center">
                  <Shield className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">User Authentication</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Multi-factor enabled</div>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Data Encryption</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">End-to-end protection</div>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Compliance</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">GDPR, HIPAA, SOC 2</div>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  // FAQ items
  const faqItems = [
    {
      question: "How long does it take to implement Zupa AFMS?",
      answer:
        "Most customers are up and running within 1-2 weeks. Our implementation team will guide you through the process, including data migration, user training, and system configuration.",
    },
    {
      question: "Can I integrate Zupa AFMS with my existing systems?",
      answer:
        "Yes, Zupa AFMS offers robust API capabilities and pre-built integrations with popular accounting, ERP, and e-commerce platforms. Our team can help you set up custom integrations as needed.",
    },
    {
      question: "Is my data secure with Zupa AFMS?",
      answer:
        "Absolutely. We employ enterprise-grade security measures including end-to-end encryption, regular security audits, and compliance with industry standards like SOC 2, GDPR, and HIPAA.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "We provide email support for all plans, with priority support for Professional plans and 24/7 dedicated support for Enterprise customers. We also offer comprehensive documentation, video tutorials, and regular webinars.",
    },
    {
      question: "Can I try Zupa AFMS before purchasing?",
      answer:
        "Yes, we offer a 14-day free trial with full access to all features. No credit card required to start your trial.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <AppLogo />
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
              >
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/login"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
              >
                Log in
              </a>
              <Button asChild variant="outline" className="rounded-full hidden sm:flex">
                <a href="/register">Register</a>
              </Button>
              <Button
                asChild
                className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
              >
                <a href="/get-started">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 max-w-xl">
              <div className="inline-block px-4 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-2 animate-fade-in">
                Introducing Zupa Distributors AFMS
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                Streamline Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Financial Operations
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Zupa Distributors AFMS helps you manage your finances, track inventory, and optimize your distribution
                operations all in one powerful, intuitive platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                >
                  <a href="/dashboard">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full group">
                  <a href="/demo" className="flex items-center">
                    <div className="mr-2 h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <div className="h-2 w-2 bg-indigo-600 dark:bg-indigo-400 rounded-full group-hover:animate-pulse"></div>
                    </div>
                    Watch Demo
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-${i * 100} flex items-center justify-center text-white text-xs font-medium`}
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">1,000+</span> businesses trust Zupa
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-300/20 dark:bg-indigo-700/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-300/20 dark:bg-purple-700/10 rounded-full blur-3xl"></div>

              <div className="relative z-10 aspect-square md:aspect-auto md:h-[500px] bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-2xl overflow-hidden shadow-xl flex items-center justify-center border border-white/50 dark:border-slate-800/50">
                <div className="absolute inset-0 bg-white/50 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-4/5 h-4/5 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 flex flex-col transform transition-all hover:scale-105 duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-lg">Financial Dashboard</h3>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="h-24 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-md mb-2 flex items-center justify-center">
                          <TrendingUp className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="h-24 bg-purple-500/20 dark:bg-purple-500/10 rounded-md mb-2 flex items-center justify-center">
                          <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="h-24 bg-blue-500/20 dark:bg-blue-500/10 rounded-md mb-2 flex items-center justify-center">
                          <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="h-24 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-md mb-2 flex items-center justify-center">
                          <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="h-3 w-3/5 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 transform rotate-6 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 w-48">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Monthly Revenue</div>
                    <div className="font-semibold">+27.4%</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -left-6 transform -rotate-6 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 w-48">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">New Customers</div>
                    <div className="font-semibold">+12 Today</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-slate-100 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Trusted by Industry Leaders</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {["Alpha", "Beta", "Gamma", "Delta", "Epsilon"].map((company) => (
              <div
                key={company}
                className="text-2xl font-bold text-slate-400 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedCounter value={10000} label="Active Users" suffix="+" />
            <AnimatedCounter value={500} label="Distribution Companies" suffix="+" />
            <AnimatedCounter value={99} label="Uptime" suffix="%" />
            <AnimatedCounter value={5000000} label="Transactions Processed" prefix="$" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-4">
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our platform provides everything you need to manage your distribution business efficiently, from financial
              analytics to inventory management.
            </p>
          </div>

          <SimpleTabs tabs={featureTabs} defaultTab="financial" />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-4">
              Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Zupa AFMS Works</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our platform is designed to be intuitive and easy to use, with a simple process to get you up and running
              quickly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
                title: "1. Create Your Account",
                description:
                  "Sign up for Zupa AFMS and set up your organization profile with your business details and user roles.",
              },
              {
                icon: <Package className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
                title: "2. Import Your Data",
                description:
                  "Easily import your existing inventory, customer, and financial data or start fresh with our templates.",
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
                title: "3. Start Managing",
                description:
                  "Use our intuitive dashboard to manage your finances, track inventory, and optimize your operations.",
              },
            ].map((step, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl relative">
                <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-bl-xl rounded-tr-xl flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
                  {i + 1}
                </div>
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
            >
              <a href="/get-started">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-4">
              Success Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Don't just take our word for it. See what our customers have to say about Zupa AFMS.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
                          quote="Zupa AFMS has transformed our distribution business. We've reduced inventory costs by 32% and improved cash flow significantly."
                          author="Sarah Johnson"
                          role="Operations Director"
                          company="Global Distributors Inc." image={undefined}            />
            <TestimonialCard
                          quote="The financial analytics tools are incredible. We now have real-time insights into our business performance that we never had before."
                          author="Michael Chen"
                          role="CFO"
                          company="Pacific Supply Chain" image={undefined}            />
            <TestimonialCard
                          quote="Implementation was smooth and the support team was exceptional. We were up and running in less than a week."
                          author="Jessica Williams"
                          role="IT Manager"
                          company="Midwest Distribution" image={undefined}            />
          </div>

          <div className="mt-12 text-center">
            <a
              href="/case-studies"
              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              Read More Success Stories
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-4">
              Flexible Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose the Right Plan for Your Business</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We offer flexible pricing options to meet the needs of businesses of all sizes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$99",
                description: "Perfect for small distribution businesses",
                features: [
                  "Up to 5 users",
                  "Basic financial analytics",
                  "Inventory management",
                  "Email support",
                  "1 GB storage",
                ],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Professional",
                price: "$249",
                description: "Ideal for growing distribution companies",
                features: [
                  "Up to 20 users",
                  "Advanced financial analytics",
                  "Inventory management with forecasting",
                  "Priority support",
                  "10 GB storage",
                  "API access",
                  "Custom reporting",
                ],
                cta: "Get Started",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large-scale distribution operations",
                features: [
                  "Unlimited users",
                  "Enterprise-grade analytics",
                  "Advanced inventory management",
                  "24/7 dedicated support",
                  "Unlimited storage",
                  "Custom integrations",
                  "Dedicated account manager",
                  "On-premise deployment option",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`bg-white dark:bg-slate-800 rounded-xl overflow-hidden border ${plan.popular ? "border-indigo-600 dark:border-indigo-400 shadow-xl" : "border-slate-200 dark:border-slate-700 shadow-md"} relative`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-4">
                    <div className="text-4xl font-bold">{plan.price}</div>
                    {plan.price !== "Custom" && <div className="text-slate-600 dark:text-slate-400 mb-1">/month</div>}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">{plan.description}</p>
                  <Button
                    asChild
                    className={`w-full rounded-full ${plan.popular ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <a href={plan.price === "Custom" ? "/contact" : "/register"}>{plan.cta}</a>
                  </Button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/30 p-8">
                  <div className="text-sm font-medium mb-4">What's included:</div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-4">
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Find answers to common questions about Zupa AFMS.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <SimpleAccordion items={faqItems} />
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">Still have questions? We're here to help.</p>
            <Button asChild variant="outline" className="rounded-full">
              <a href="/contact">Contact Support</a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-indigo-100 mb-8 text-lg">
              Join thousands of distributors who have streamlined their operations with Zupa AFMS. Start your 14-day
              free trial today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="rounded-full">
                <a href="/register">Start Free Trial</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 rounded-full"
              >
                <a href="/demo">Schedule Demo</a>
              </Button>
            </div>
            <p className="text-indigo-100 mt-6 text-sm">No credit card required. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <AppLogo />
              <p className="mt-4 text-slate-400 text-sm">
                Zupa Distributors AFMS helps distribution businesses streamline their financial operations and optimize
                inventory management.
              </p>
              <div className="flex gap-4 mt-6">
                {["twitter", "facebook", "linkedin", "instagram"].map((social) => (
                  <a
                    key={social}
                    href={`https://${social}.com`}
                    className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-4 h-4 bg-white/80 rounded-sm"></div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "Case Studies", "Reviews", "Updates"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {["About", "Careers", "Partners", "Blog", "Press"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                {["Help Center", "Contact", "Documentation", "Status", "Training"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Zupa Distributors. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="/terms" className="text-sm text-slate-400 hover:text-white">
                Terms
              </a>
              <a href="/privacy" className="text-sm text-slate-400 hover:text-white">
                Privacy
              </a>
              <a href="/cookies" className="text-sm text-slate-400 hover:text-white">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

