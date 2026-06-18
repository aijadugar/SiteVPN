"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, CheckCircle2, X } from "lucide-react"

interface CustomEmailToggleFormProps {
  onUpdate: (email: string) => void
  isLoading: boolean
  onClose: () => void
}

const PRESET_DOMAINS = ["@sitevpn.me", "@tempmail.pro", "@privacy.dev"]

export function CustomEmailToggleForm({ onUpdate, isLoading, onClose }: CustomEmailToggleFormProps) {
  const [username, setUsername] = useState("")
  const [customDomain, setCustomDomain] = useState("")
  const [selectedDomain, setSelectedDomain] = useState(PRESET_DOMAINS[0])
  const [useCustomDomain, setUseCustomDomain] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false)

  const validateUsername = (value: string) => {
    setError(null)
    setIsValid(false)

    if (!value.trim()) {
      return
    }

    const regex = /^[a-zA-Z0-9._-]+$/
    if (!regex.test(value)) {
      setError("Only letters, numbers, dots, hyphens, and underscores allowed")
      return
    }

    if (value.length < 3) {
      setError("Username must be at least 3 characters")
      return
    }

    if (value.length > 30) {
      setError("Username must be less than 30 characters")
      return
    }

    setIsValid(true)
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)
    validateUsername(value)
  }

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.trim()
    if (value && !value.startsWith("@")) {
      value = "@" + value
    }
    setCustomDomain(value)
  }

  const handleUpdate = () => {
    if (!isValid) return
    const domain = useCustomDomain ? customDomain : selectedDomain
    onUpdate(username + domain)
    setUsername("")
    setCustomDomain("")
    setSelectedDomain(PRESET_DOMAINS[0])
    setUseCustomDomain(false)
    setIsValid(false)
  }

  const finalDomain = useCustomDomain ? customDomain : selectedDomain

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-900 font-semibold text-lg">Create Custom Email</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Username Input */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">Username</label>
          <input
            type="text"
            placeholder="mychosenname"
            value={username}
            onChange={handleUsernameChange}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
          />
          {username && (
            <div className="mt-2 text-xs">
              {isValid ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Email is available</span>
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Domain Selection Tabs */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-3 block">Domain</label>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setUseCustomDomain(false)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${!useCustomDomain ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Preset
            </button>
            <button
              onClick={() => setUseCustomDomain(true)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${useCustomDomain ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Custom
            </button>
          </div>

          {!useCustomDomain ? (
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              {PRESET_DOMAINS.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          ) : (
            <div>
              <div className="relative">
                <div className="absolute left-4 top-3 text-gray-700 font-medium">@</div>
                <input
                  type="text"
                  placeholder="yourdomain.com"
                  value={customDomain.replace(/^@/, "")}
                  onChange={(e) => {
                    let value = e.target.value.trim()
                    if (value) {
                      value = "@" + value
                    }
                    setCustomDomain(value)
                  }}
                  disabled={isLoading}
                  className="w-full pl-8 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {isValid && (
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Your email will be</p>
            <p className="font-mono font-bold text-primary text-sm break-all">{username + finalDomain}</p>
          </div>
        )}

        <button
          onClick={handleUpdate}
          disabled={!isValid || isLoading}
          className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  )
}
