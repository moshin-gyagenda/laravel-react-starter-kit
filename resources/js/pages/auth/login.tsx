"use client"

import { Head, useForm } from "@inertiajs/react"
import { LoaderCircle, Mail, Lock, ArrowRight, Github } from "lucide-react"
import { type FormEventHandler, useState, useEffect } from "react"

import InputError from "@/components/input-error"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePage } from "@inertiajs/react"

type LoginForm = {
  email: string
  password: string
  remember: boolean
}

interface LoginProps {
  status?: string
  canResetPassword: boolean
}

export default function Login({ status, canResetPassword }: LoginProps) {
  usePage()
  const [isLoaded, setIsLoaded] = useState(false)
  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    email: "",
    password: "",
    remember: false,
  })

  // Prevent blank screen by showing content only after component is mounted
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route("login"), {
      onFinish: () => reset("password"),
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

            <h1 className="text-4xl font-bold mb-6">Welcome to Zupa Distributors</h1>
            <p className="text-lg text-indigo-100 mb-8">
              Log in to access your dashboard and manage your distribution operations efficiently.
            </p>

            <div className="space-y-6">
              {[
                {
                  number: "01",
                  title: "Financial Analytics",
                  description: "Track your financial performance in real-time",
                },
                {
                  number: "02",
                  title: "Inventory Management",
                  description: "Optimize your inventory across multiple locations",
                },
                {
                  number: "03",
                  title: "Security & Compliance",
                  description: "Enterprise-grade security for your data",
                },
              ].map((feature) => (
                <div key={feature.number} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-sm font-medium group-hover:bg-white/20 transition-colors">
                    {feature.number}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{feature.title}</h3>
                    <p className="text-indigo-200 text-sm">{feature.description}</p>
                  </div>
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

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md">
          <Head title="Log in" />

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h2>
            <p className="text-slate-600 dark:text-slate-400">Log in to your account to continue</p>
          </div>

          {status && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium border border-green-100 dark:border-green-900/30 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {status}
            </div>
          )}

          <form className="flex flex-col gap-6" onSubmit={submit}>
            <div className="grid gap-6">
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
                    autoFocus
                    tabIndex={1}
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="email@example.com"
                    className="border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500 pr-10 transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  </div>
                </div>
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  {canResetPassword && (
                    <TextLink
                      href={route("password.request")}
                      className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                      tabIndex={5}
                    >
                      Forgot password?
                    </TextLink>
                  )}
                </div>
                <div className="relative group">
                  <Input
                    id="password"
                    type="password"
                    required
                    tabIndex={2}
                    autoComplete="current-password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder="••••••••"
                    className="border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500 pr-10 transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  </div>
                </div>
                <InputError message={errors.password} />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={data.remember}
                  onClick={() => setData("remember", !data.remember)}
                  tabIndex={3}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400">
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all rounded-lg h-12"
                tabIndex={4}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Log in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <TextLink
                href={route("register")}
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
                tabIndex={5}
              >
                Sign up
              </TextLink>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Google
                  </div>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    <Github className="h-5 w-5 mr-2" />
                    GitHub
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-500">
            By logging in, you agree to our
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

