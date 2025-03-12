import Link from "next/link"
import { Button } from "@/components/ui/button"
import AppLogo from "@/components/app-logo"

export default function Welcome() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
      <header className="mb-6 w-full max-w-[335px] text-sm lg:max-w-4xl">
        <nav className="flex items-center justify-between">
          <AppLogo />
          <div className="flex gap-4">
            <Link
              href="/login"
              className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal hover:border-[#19140035] dark:hover:border-[#3E3E3A]"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>
      <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow">
        <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
          <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
            <h1 className="mb-1 text-xl font-medium">Welcome to Zupa Distributors AFMS</h1>
            <p className="mb-2 text-[#706f6c] dark:text-[#A1A09A]">
              Get started with our Automated Financial Management System.
              <br />
              Here are some quick links to help you:
            </p>
            <ul className="mb-4 flex flex-col lg:mb-6">
              <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                <span className="relative bg-white py-1 dark:bg-[#161615]">
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                  </span>
                </span>
                <span>
                  View the
                  <Link
                    href="/dashboard"
                    className="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                  >
                    <span>Dashboard</span>
                    <svg
                      width={10}
                      height={11}
                      viewBox="0 0 10 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2.5 w-2.5"
                    >
                      <path
                        d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                        stroke="currentColor"
                        strokeLinecap="square"
                      />
                    </svg>
                  </Link>
                </span>
              </li>
              <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                <span className="relative bg-white py-1 dark:bg-[#161615]">
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                  </span>
                </span>
                <span>
                  Check the
                  <Link
                    href="/inventory"
                    className="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                  >
                    <span>Inventory</span>
                    <svg
                      width={10}
                      height={11}
                      viewBox="0 0 10 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2.5 w-2.5"
                    >
                      <path
                        d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                        stroke="currentColor"
                        strokeLinecap="square"
                      />
                    </svg>
                  </Link>
                </span>
              </li>
            </ul>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
          <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-[#fff2f2] lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:bg-[#1D0002]">
            {/* <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80"
              alt="Financial Management Illustration"
              fill
              style={{ objectFit: "cover" }}
              className="opacity-50"
            /> */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <AppLogo />
                <h2 className="mt-4 text-2xl font-bold text-primary">Zupa Distributors AFMS</h2>
                <p className="mt-2 text-muted-foreground">Streamline Your Financial Operations</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

