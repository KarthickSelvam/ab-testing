"use client"

import Image from "next/image"
import Link from "next/link"
import { LogOut, User } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface AppLayoutProps {
  children: React.ReactNode
  onNavigate: (page: "home" | "experiments" | "reports") => void
  currentPage: "home" | "experiments" | "reports"
}

export function AppLayout({ children, onNavigate, currentPage }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col w-full">
        {/* Header */}
        <header className="flex h-[60px] items-center border-b bg-[#006FCF] px-6 relative z-50 w-full absolute left-0 right-0">
          <Image
            src="https://www.aexp-static.com/cdaas/one/statics/axp-static-assets/2.24.1/package/dist/img/logos/dls-logo-line-white.svg"
            alt="American Express"
            width={170}
            height={170}
            className="mr-3"
          />
          <span className="text-white mx-3">|</span>
          <span className="text-[15px] font-small text-white">A/B Testing Platform</span>
        </header>

        {/* Sidebar and Main Content */}
        <div className="flex flex-1">
          <Sidebar className="w-[240px] border-r bg-white flex flex-col">
            <div className="flex-grow pt-[60px]">
              <SidebarContent className="p-0">
                <nav className="space-y-1 py-4">
                  <Link 
                    href="#"
                    onClick={() => onNavigate("experiments")}
                    className={`flex items-center px-6 py-2 text-[15px] font-medium ${
                      currentPage === "experiments" 
                      ? "bg-[#E6F2FF] text-[#006FCF]" 
                      : "text-[#006FCF] hover:bg-[#E6F2FF]"
                    }`}
                  >
                    Experiments
                  </Link>
                  <Link 
                    href="#"
                    onClick={() => onNavigate("reports")}
                    className="flex items-center px-6 py-2 text-[15px] font-medium text-[#006FCF] hover:bg-[#E6F2FF]"
                  >
                    Reports
                  </Link>
                </nav>
              </SidebarContent>
            </div>
            <div className="border-t p-4 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-gray-500">john.doe@example.com</p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-[#006FCF]">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Sidebar>

          {/* Main Content */}
          <SidebarInset>
            <main className="flex-1 p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}

