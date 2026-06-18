"use client"
import Link from "next/link"
import { Github, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary/30 dark:bg-secondary/10 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div>
            <div className="flex flex-col items-start gap-5">
              <img
                src="/sitevpn_logo.png"
                alt="SiteVPN Logo"
                className="w-16 h-16 object-contain ml-8"
              />

              <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                <img
                  src="/sitevpn_logo.png"
                  alt="SiteVPN Logo"
                  className="w-9 h-9 object-contain"
                />
                SiteVPN
              </h3>
            </div>

            <p className="text-foreground/60 text-sm">
              Open-source privacy tools <br /> for safer & faster internet.
            </p>

            {/* System Status */}
            <Link
              href="/status"
              className="flex items-center gap-2 mt-4 text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              System Status
            </Link>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/vpn" className="text-foreground/60 hover:text-primary transition-colors">
                  VPN
                </Link>
              </li>
              <li>
                <Link href="/temp-mail" className="text-foreground/60 hover:text-primary transition-colors">
                  Temp Email
                </Link>
              </li>
              <li>
                <Link href="/temp-number" className="text-foreground/60 hover:text-primary transition-colors">
                  Temp Number
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-foreground/60 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-foreground/60 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/audit" className="text-foreground/60 hover:text-primary transition-colors">
                  Audit Report
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Community</h4>
            <div className="flex gap-4">

              <a
                href="https://github.com/"
                aria-label="GitHub"
                className="w-10 h-10 rounded-xl bg-white/5 dark:bg-black/10 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </a>

              <a
                href="https://linkedin.com/"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-xl bg-white/5 dark:bg-black/10 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              <a
                href="https://instagram.com/"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-white/5 dark:bg-black/10 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </a>

            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-foreground/50">
          <p>&copy; {new Date().getFullYear()} SiteVPN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
