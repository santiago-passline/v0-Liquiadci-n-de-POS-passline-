"use client"

import { ChevronDown, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="bg-[#1E2130] text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 bg-[#F7B928] rounded-sm flex items-center justify-center transform rotate-45">
                <div className="transform -rotate-45">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
              </div>
              <span className="ml-2 text-xl font-semibold">
                <span className="text-white">Pass</span>
                <span className="text-[#F7B928]">line</span>
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/clientes"
              className={`${
                isActive("/clientes") ? "text-[#F7B928]" : "text-white hover:text-[#F7B928]"
              } px-3 py-2 text-sm font-medium`}
            >
              Clientes
            </Link>
            <Link
              href="/liquidaciones"
              className={`${
                isActive("/liquidaciones") ? "text-[#F7B928]" : "text-white hover:text-[#F7B928]"
              } px-3 py-2 text-sm font-medium`}
            >
              Liquidaciones
            </Link>
            <Link
              href="/equipos-pos"
              className={`${
                isActive("/equipos-pos") ? "text-[#F7B928]" : "text-white hover:text-[#F7B928]"
              } px-3 py-2 text-sm font-medium`}
            >
              Equipos POS
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center text-sm">
                  <span className="text-[#F7B928] mr-1">{user?.name || "Usuario"}</span>
                  <ChevronDown className="h-4 w-4 text-[#F7B928]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/">
              <Button className="bg-[#F7B928] hover:bg-[#e5aa25] text-black ml-4">Nueva Liquidación</Button>
            </Link>
            <div className="flex items-center ml-2 text-sm">
              <span>Uruguay</span>
              <span className="mx-1">|</span>
              <span>ES</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/clientes"
            className={`${
              isActive("/clientes") ? "bg-gray-700" : ""
            } text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium`}
          >
            Clientes
          </Link>
          <Link
            href="/liquidaciones"
            className={`${
              isActive("/liquidaciones") ? "bg-gray-700" : ""
            } text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium`}
          >
            Liquidaciones
          </Link>
          <Link
            href="/equipos-pos"
            className={`${
              isActive("/equipos-pos") ? "bg-gray-700" : ""
            } text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium`}
          >
            Equipos POS
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-white">{user?.name || "Usuario"}</div>
            </div>
          </div>
          <div className="mt-3 px-2 space-y-1">
            <Link href="/">
              <Button className="w-full bg-[#F7B928] hover:bg-[#e5aa25] text-black mb-2">Nueva Liquidación</Button>
            </Link>
            <Button onClick={logout} variant="outline" className="w-full text-white">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
