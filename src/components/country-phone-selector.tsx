"use client"

import { useState, useMemo } from "react"
import { ChevronDown, Search } from "lucide-react"

interface PhoneCountry {
  code: string
  name: string
  flag: string
  countryCode: string
  available: number
  numbers: string[]
}

const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: "US", name: "United States", flag: "🇺🇸", countryCode: "+1", available: 245, numbers: ["+11234567890", "+19876543210", "+12135551212"] },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", countryCode: "+44", available: 128, numbers: ["+11234567890", "+19876543210", "+12135551212"] },
  { code: "CA", name: "Canada", flag: "🇨🇦", countryCode: "+1", available: 95, numbers: ["+11234567890", "+19876543210", "+12135551212"] },
  { code: "AU", name: "Australia", flag: "🇦🇺", countryCode: "+61", available: 67, numbers: ["+11234567890", "+19876543210", "+12135551212"] },
  { code: "FR", name: "France", flag: "🇫🇷", countryCode: "+33", available: 45, numbers: ["+11234567890", "+19876543210", "+12135551212"] },
  { code: "DE", name: "Germany", flag: "🇩🇪", countryCode: "+49", available: 89, numbers: ["+11234567890", "+19876543210", "+12135551212"] },
  { code: "JP", name: "Japan", flag: "🇯🇵", countryCode: "+81", available: 34, numbers: ["+11234567890", "+19876543210", "+12135551212"] },
  { code: "SG", name: "Singapore", flag: "🇸🇬", countryCode: "+65", available: 28, numbers: ["+11234567890", "+19876543210", "+12135551212"] },
]

interface CountryPhoneSelectorProps {
  onSelect: (country: PhoneCountry) => void
  onNumbersAvailable: (numbers: string[]) => void
  selected?: PhoneCountry
}

export function CountryPhoneSelector({ onSelect, onNumbersAvailable, selected }: CountryPhoneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = useMemo(
    () => PHONE_COUNTRIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  )

  const getAvailabilityColor = (available: number) => {
    if (available > 100) return "bg-green-500"
    if (available > 50) return "bg-yellow-500"
    return "bg-orange-500"
  }

  const handleSelectCountry = (country: PhoneCountry) => {
    onNumbersAvailable(country.numbers)
    onSelect(country)
    setIsOpen(false)
    setSearch("")
  }

  return (
    <div className="relative w-full">
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-white dark:bg-card border border-border rounded-xl glass flex items-center justify-between hover:border-primary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {selected ? (
            <div className="text-left">
              <div className="text-lg">{selected.flag}</div>
            </div>
          ) : null}
          <div className="text-left flex-1">
            <div className="text-sm font-medium">{selected ? selected.name : "Select country..."}</div>
            <div className="text-xs text-muted-foreground">
              {selected ? `${selected.available} numbers available` : ""}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
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

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {filtered.map((country) => (
              <button
                key={country.code}
                onClick={() => handleSelectCountry(country)}
                className={`w-full px-4 py-3 flex items-center justify-between hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-left border-b border-border/50 last:border-0 ${selected?.code === country.code ? "bg-primary/10" : ""
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <div className="font-medium text-sm">{country.name}</div>
                    <div className="text-xs text-muted-foreground">{country.countryCode}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(country.available)}`} />
                  <p className="text-xs text-muted-foreground mt-1">{country.available}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
