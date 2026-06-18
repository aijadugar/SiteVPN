"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Menu, X, Shield, Lock } from "lucide-react"
import { AuthActions } from "@/components/auth-actions"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navItemRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({})

  const navItems = [
    { label: "Home", href: "/" },
    { label: "VPN", href: "/vpn" },
    { label: "Temp Mail", href: "/temp-mail" },
    { label: "Temp Number", href: "/temp-number" },
    { label: "Contact", href: "/contact" },
  ]

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const element = e.currentTarget
    const rect = element.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    element.style.setProperty("--mouse-x", `${x}%`)
    element.style.setProperty("--mouse-y", `${y}%`)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/30 dark:border-white/10 bg-background/40 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 transition-all duration-300">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">

        <Link href="/" className="flex items-center gap-3">

          <img
            src="/sitevpn_logo.png"
            alt="SiteVPN Logo"
            className="h-10 w-10 rounded-xl object-cover"
          />

          <span className="text-xl font-bold text-foreground">SiteVPN</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-item text-foreground/70 hover:text-primary transition-all duration-300 text-sm font-medium relative px-3 py-2 rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10"
              onMouseMove={handleMouseMove}
            >
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3 text-xs pl-8 border-l border-border transition-all duration-300">
          <AuthActions />

          <div
            className="flex items-center gap-2 hover:scale-110 transition-transform duration-300
               rounded-full px-3 py-1.5
               bg-white dark:bg-white/10
               border border-white dark:border-white/20
               shadow-sm"
          >
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-glow-strong"></div>
            <span className="text-muted-foreground">100% Zero Install</span>
          </div>

          <div
            className="flex items-center gap-2 hover:scale-110 transition-transform duration-300
               rounded-full px-3 py-1.5
               bg-white dark:bg-white/10
               border border-white dark:border-white/20
               shadow-sm"
          >
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-glow-strong"></div>
            <span className="text-muted-foreground">Open-source</span>
          </div>

          <div
            className="flex items-center gap-2 hover:scale-110 transition-transform duration-300
               rounded-full px-3 py-1.5
               bg-white dark:bg-white/10
               border border-white dark:border-white/20
               shadow-sm"
          >
            <div className="h-2.5 w-2.5 rounded-full bg-orange-500 animate-glow-strong"></div>
            <span className="text-muted-foreground">No Logs</span>
          </div>

        </div>




        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden pb-4 space-y-2 animate-smooth-fade">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-foreground/70 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 rounded-lg transition-all duration-300 hover:translate-x-1"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

    </nav>
  )
}
