"use client"

import { useState, useMemo } from "react"
import { ChevronDown, Search, MapPin } from "lucide-react"

export interface Country {
  code: string
  name: string
  flag: string
  latency: number
  available: number
}

const COUNTRIES: Country[] = [
  { code: "IN", name: "India", flag: "🇮🇳", latency: 8, available: 52 },
  { code: "US", name: "United States", flag: "🇺🇸", latency: 12, available: 45 },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", latency: 28, available: 32 },
  { code: "DE", name: "Germany", flag: "🇩🇪", latency: 35, available: 28 },
  { code: "FR", name: "France", flag: "🇫🇷", latency: 38, available: 24 },
  { code: "JP", name: "Japan", flag: "🇯🇵", latency: 145, available: 18 },
  { code: "SG", name: "Singapore", flag: "🇸🇬", latency: 98, available: 22 },
  { code: "AU", name: "Australia", flag: "🇦🇺", latency: 156, available: 15 },
  { code: "CA", name: "Canada", flag: "🇨🇦", latency: 32, available: 26 },
]

interface CountrySelectorProps {
  onSelect: (country: Country) => void
  selected?: Country
}

export function CountrySelector({ onSelect, selected }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => COUNTRIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())), [search])

  return (
    <div className="relative w-full">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-white dark:bg-card border border-border rounded-xl glass flex items-center justify-between hover:border-primary/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-primary" />
          {selected ? (
            <div className="text-left">
              <div className="text-sm font-medium text-foreground">{selected.name}</div>
              <div className="text-xs text-muted-foreground">{selected.latency}ms latency</div>
            </div>
          ) : (
            <span className="text-foreground/50">Select a country...</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-border flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm placeholder-muted-foreground"
            />
          </div>

          {/* Country List */}
          <div className="max-h-80 overflow-y-auto">
            {filtered.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  onSelect(country)
                  setIsOpen(false)
                  setSearch("")
                }}
                className={`w-full px-4 py-3 flex items-center justify-between hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-left border-b border-border/50 last:border-0 ${
                  selected?.code === country.code ? "bg-primary/10" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <div className="font-medium">{country.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {country.latency}ms • {country.available} servers
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${country.latency < 50 ? "bg-green-500" : country.latency < 100 ? "bg-yellow-500" : "bg-orange-500"}`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
