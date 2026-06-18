"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, AlertCircle, Send } from "lucide-react"

interface SMSForwardingFormProps {
  isEnabled: boolean
  selectedNumber: string
  messages: number
  onToggle: (enabled: boolean) => void
  onEnableForwarding: (mobileNumber: string) => void
  onTransferSMS: () => void
  isLoading: boolean
  forwardingNumber: string | null
  disableForwarding: () => void // Added disableForwarding function
}

const COUNTRY_CODES = [
  { code: "+1", country: "US/Canada" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+81", country: "Japan" },
]

export function SMSForwardingForm({
  isEnabled,
  selectedNumber,
  messages,
  onToggle,
  onEnableForwarding,
  onTransferSMS,
  isLoading,
  forwardingNumber,
  disableForwarding, // Passed disableForwarding function as prop
}: SMSForwardingFormProps) {
  const [mobileNumber, setMobileNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [error, setError] = useState<string | null>(null)

  const handleEnableForwarding = () => {
    if (!mobileNumber.trim()) {
      setError("Please enter a mobile number")
      return
    }

    const fullNumber = countryCode + mobileNumber.replace(/\D/g, "")
    if (fullNumber.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    setError(null)
    onEnableForwarding(fullNumber)
    setMobileNumber("")
  }

  const handleToggle = () => {
    if (isEnabled) {
      disableForwarding();        // fully disable when turning OFF
      onToggle(false);            // notify parent it's OFF
    } else {
      onToggle(true);             // just turn ON
    }

    setMobileNumber("");
    setError(null);
  };


  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">SMS Forwarding</h3>
        <button
          onClick={handleToggle}
          className={`w-12 h-6 rounded-full transition-colors ${isEnabled ? "bg-primary" : "bg-gray-300"
            } relative`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 ${isEnabled ? "translate-x-6" : "translate-x-0.5"
              }`}
          />
        </button>

      </div>

      {isEnabled && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs text-gray-600 mb-1">Your Temporary Number</p>
            <p className="font-mono font-semibold text-primary">{selectedNumber}</p>
          </div>

          {!forwardingNumber && (
            <>
              {/* Country Code */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Country Code</label>
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer text-gray-900"
                  >
                    {COUNTRY_CODES.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.code} {item.country}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600" />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Your Mobile Number</label>
                <input
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-900"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              {/* Enable Button */}
              <Button onClick={handleEnableForwarding} disabled={isLoading} className="w-full bg-primary">
                {isLoading ? "Enabling..." : "Enable Forwarding"}
              </Button>
            </>
          )}

          {forwardingNumber && (
            <>
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs text-gray-600 mb-1">Forwarding To</p>
                <p className="font-mono font-semibold text-primary">{forwardingNumber}</p>
              </div>

              {messages > 0 && (
                <Button onClick={onTransferSMS} disabled={isLoading} className="w-full gap-2 bg-primary">
                  <Send className="w-4 h-4" />
                  Transfer {messages} SMS
                </Button>
              )}

              {/* Change Number Button */}
              <Button
                onClick={() => {
                  disableForwarding() // Change button now properly disables and resets forwarding
                  setMobileNumber("")
                  setError(null)
                }}
                variant="outline"
                className="w-full bg-white"
              >
                Change Number
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
