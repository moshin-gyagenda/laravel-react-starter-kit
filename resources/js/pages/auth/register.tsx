"use client"

import { Head, useForm } from "@inertiajs/react"
import { LoaderCircle, User, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react"
import { type FormEventHandler, useState, useEffect } from "react"

import InputError from "@/components/input-error"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type RegisterForm = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export default function Register() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  })

  // Prevent blank screen by showing content only after component is mounted
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation"),
    })
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 opacity-75 blur"></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-lg p-8 flex items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Decorative */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-indigo-600 font-bold text-xl shadow-lg">
                Z
              </div>
              <span className="font-semibold text-xl">Zupa</span>
            </div>

            <h1 className="text-4xl font-bold mb-6">Join Zupa Distributors</h1>
            <p className="text-lg text-indigo-100 mb-8">
              Create your account and start managing your distribution operations efficiently.
            </p>

            <div className="space-y-6 mt-12">
              <h3 className="text-xl font-semibold mb-4">Why choose Zupa?</h3>
              {[
                { icon: <CheckCircle className="h-5 w-5" />, text: "Streamlined financial operations" },
                { icon: <CheckCircle className="h-5 w-5" />, text: "Advanced inventory management" },
                { icon: <CheckCircle className="h-5 w-5" />, text: "Real-time analytics and reporting" },
                { icon: <CheckCircle className="h-5 w-5" />, text: "Enterprise-grade security" },
                { icon: <CheckCircle className="h-5 w-5" />, text: "Dedicated customer support" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">{item.icon}</div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-12 border-t border-indigo-500/30">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-white/90 flex items-center justify-center text-indigo-600 text-xs font-medium"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm">
                <span className="font-semibold">1,000+</span> businesses trust Zupa
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Registration form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md">
          <Head title="Register" />

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create an account</h2>
            <p className="text-slate-600 dark:text-slate-400">Enter your details below to create your account</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={submit}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name" className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <User className="h-4 w-4" />
                  Name
                </Label>
                <div className="relative group">
                  <Input
                    id="name"
                    type="text"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    disabled={processing}
                    placeholder="Full name"
                    className="border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500 pr-10 transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  </div>
                </div>
                <InputError message={errors.name} className="mt-1 text-sm" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Mail className="h-4 w-4" />
                  Email address
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    required
                    tabIndex={2}
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    disabled={processing}
                    placeholder="email@example.com"
                    className="border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500 pr-10 transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  </div>
                </div>
                <InputError message={errors.email} className="mt-1 text-sm" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type="password"
                    required
                    tabIndex={3}
                    autoComplete="new-password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    disabled={processing}
                    placeholder="Password"
                    className="border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500 pr-10 transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  </div>
                </div>
                <InputError message={errors.password} className="mt-1 text-sm" />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="password_confirmation"
                  className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300"
                >
                  <Lock className="h-4 w-4" />
                  Confirm password
                </Label>
                <div className="relative group">
                  <Input
                    id="password_confirmation"
                    type="password"
                    required
                    tabIndex={4}
                    autoComplete="new-password"
                    value={data.password_confirmation}
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    disabled={processing}
                    placeholder="Confirm password"
                    className="border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500 pr-10 transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  </div>
                </div>
                <InputError message={errors.password_confirmation} className="mt-1 text-sm" />
              </div>

              <Button
                type="submit"
                className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all rounded-lg h-12"
                tabIndex={5}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <TextLink
                href={route("login")}
                tabIndex={6}
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
              >
                Log in
              </TextLink>
            </div>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-500">
            By creating an account, you agree to our
            <TextLink
              href="#"
              className="text-slate-700 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mx-1"
            >
              Terms of Service
            </TextLink>
            and
            <TextLink
              href="#"
              className="text-slate-700 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mx-1"
            >
              Privacy Policy
            </TextLink>
          </div>
        </div>
      </div>
    </div>
  )
}

