"use client"

import { useState, useEffect } from "react"
import { Copy, RefreshCw, Edit2, Trash2, Lock } from "lucide-react"

interface TempEmailCardProps {
  email: string
  isLoading: boolean
  isRefreshing: boolean
  onRefresh: () => void
  onDelete: () => void
  onChangeEmail: () => void
}

export function TempEmailCard({
  email,
  isLoading,
  isRefreshing,
  onRefresh,
  onDelete,
  onChangeEmail,
}: TempEmailCardProps) {
  const [copied, setCopied] = useState(false)
  const [currentEmail, setCurrentEmail] = useState(email);
  const [locked, setLocked] = useState(false);



  useEffect(() => {
    const saved = localStorage.getItem("locked_email");
    if (saved) {
      setCurrentEmail(saved);
      setLocked(true);
    } else {
      setCurrentEmail(email);
    }
  }, [email]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentEmail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const toggleLock = () => {
    if (!locked) {
      localStorage.setItem("locked_email", currentEmail);
      setLocked(true);
    } else {
      localStorage.removeItem("locked_email");
      setLocked(false);
      setCurrentEmail(email);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 min-h-[280px] flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full"></div>
        </div>
      </div>
    )
  }




  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <div className="text-center mb-8">

        {/* Email Display with Icons */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex items-center relative">
          <div className="flex-1">
            <p className="font-mono text-2xl font-bold text-primary break-all text-center w-full">{currentEmail}
            </p>
          </div>
          <div className="absolute right-4 flex gap-3">
            <button
              onClick={() => navigator.clipboard.writeText(currentEmail)} className="w-12 h-12 rounded-full bg-gray-200/50 hover:bg-gray-300/50 border border-gray-300 hover:border-gray-400 transition-all flex items-center justify-center flex-shrink-0" title="Copy Email">

              <Copy className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={toggleLock}
              className={`w-12 h-12 rounded-full transition-all flex items-center justify-center flex-shrink-0 border 
    ${locked ? "bg-primary/30 border-primary/60" : "bg-primary/15 hover:bg-primary/25 border-primary/30 hover:border-primary/50"}`}
              title="Lock Email"
            >

              <Lock className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Text */}
      <p className="text-gray-600 text-sm text-center mb-8 leading-relaxed">
        Forget about spam, advertising mailings, hacking and attacking robots. Keep your real mailbox clean and secure. <br />
        Temp Mail provides temporary, secure, anonymous, free, disposable email address.
      </p>

      <div className="grid grid-cols-4 gap-3">
        <button
          onClick={handleCopy}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 rounded-full text-foreground font-medium text-sm transition-all flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 rounded-full text-foreground font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>

        <button
          onClick={onChangeEmail}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 rounded-full text-foreground font-medium text-sm transition-all flex items-center justify-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          <span>Change</span>
        </button>

        <button
          onClick={onDelete}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 rounded-full text-foreground font-medium text-sm transition-all flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  )
}
