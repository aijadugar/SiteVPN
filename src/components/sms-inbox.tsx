"use client"

import { useState } from "react"
import { MessageSquare, X } from "lucide-react"
import type { SMSMessage } from "@/hooks/use-temp-number"

interface SMSInboxProps {
  messages: SMSMessage[]
  isRefreshing: boolean
  onRefresh: () => void
}

export function SMSInbox({ messages, isRefreshing, onRefresh }: SMSInboxProps) {
  const [selectedMessage, setSelectedMessage] = useState<SMSMessage | null>(null)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <div className="grid grid-cols-3 gap-4 px-6 py-4 font-semibold text-sm text-gray-700 uppercase tracking-wide bg-gray-50 border-b border-gray-200">
          <div>Sender</div>
          <div>Subject</div>
          <div className="text-right">View</div>
        </div>

        <div className="divide-y divide-gray-200 relative">
          {isRefreshing && messages.length > 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-40">
              <div className="text-center">
                <div className="animate-spin mb-3 inline-block">
                  <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full"></div>
                </div>
                <p className="text-xs text-gray-600">Refreshing...</p>
              </div>
            </div>
          )}

          {isRefreshing && !messages.length ? (
            <div className="col-span-3 flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin mb-4 inline-block">
                  <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600">Refreshing inbox...</p>
              </div>
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className="grid grid-cols-3 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="text-sm text-gray-700">{msg.from}</div>
                <div className="text-sm text-gray-700 truncate">{msg.content}</div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedMessage(msg)}
                    className="px-3 py-1 bg-primary/15 hover:bg-primary/25 text-primary text-xs font-medium rounded transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-16">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-600">No SMS received yet</p>
              <p className="text-xs text-gray-500">Your SMS will appear here</p>
            </div>
          )}
        </div>
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl w-full max-h-[80vh] overflow-auto shadow-lg">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-foreground font-semibold text-lg">Message Details</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">From</p>
                <p className="text-foreground font-medium">{selectedMessage.from}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-2">Message</p>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 text-sm whitespace-pre-wrap">
                  {selectedMessage.content}
                </div>
              </div>
              <div className="text-xs text-gray-600 pt-4 border-t border-gray-200">
                Received at {selectedMessage.timestamp.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
