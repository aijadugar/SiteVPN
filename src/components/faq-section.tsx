"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const FAQS = [
  {
    question: "Is my data really never logged?",
    answer:
      "Yes. We operate with a strict no-logs policy that is independently audited every year. We have no ability to access your data, even if legally required.",
  },
  {
    question: "How does WireGuard encryption work?",
    answer:
      "WireGuard is a modern VPN protocol that uses Noise Framework for authentication and encryption. It's faster and more secure than older protocols like OpenVPN.",
  },
  {
    question: "Can I see the code?",
    answer:
      "Absolutely. All our code is on GitHub under an open-source license. You can review, audit, and contribute to the project.",
  },
  {
    question: "How are temporary emails kept private?",
    answer:
      "Temporary emails are isolated in our system. Each email address is unique and expires after 24 hours of inactivity. No data is sold or shared.",
  },
  {
    question: "What happens if I forget to disconnect my VPN?",
    answer:
      "Your connection will remain active, keeping your traffic encrypted. However, we recommend disconnecting when not in use to save resources.",
  },
  {
    question: "Is there a free tier?",
    answer:
      "Our open-source tools are free to use and deploy. Check our GitHub for installation instructions or use our hosted service.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-foreground/60">Everything you need to know about SiteVPN</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-white/5 dark:hover:bg-black/10 transition-colors text-left"
              >
                <h3 className="font-semibold">{faq.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${openIndex === idx ? "rotate-180" : ""
                    }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-4 md:px-6 pt-4 md:pt-5 pb-4 md:pb-6 text-foreground/60 text-sm border-t border-border">
                  {faq.answer}
                </div>

              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
