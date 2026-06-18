"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Github, Send } from "lucide-react"

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock submission
    setSubmitted(true)
    setTimeout(() => {
      setFormState({ name: "", email: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white via-white to-secondary/20 dark:from-background dark:via-background dark:to-secondary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Mail,
                title: "Email",
                description: "hello@sitevpn.app",
                link: "mailto:hello@sitevpn.app",
              },
              {
                icon: MessageSquare,
                title: "Discord Community",
                description: "Join our community server",
                link: "#",
              },
              {
                icon: Github,
                title: "GitHub Issues",
                description: "Report bugs or request features",
                link: "https://github.com",
              },
            ].map((method) => {
              const Icon = method.icon
              return (
                <a
                  key={method.title}
                  href={method.link}
                  className="p-6 bg-white dark:bg-card border border-border rounded-xl hover:border-primary/50 transition-all group"
                >
                  <Icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-2">{method.title}</h3>
                  <p className="text-sm text-foreground/60">{method.description}</p>
                </a>
              )
            })}
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-card border border-border rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg">
                <p className="text-green-800 dark:text-green-300 font-medium">Message sent successfully!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 dark:bg-black/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 dark:bg-black/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <textarea
                  required
                  rows={6}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 dark:bg-black/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  placeholder="Tell us what you think..."
                />
              </div>

              {/* Submit */}
              <Button type="submit" size="lg" className="w-full gap-2 bg-primary">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-8 bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-xl">
            <h3 className="font-semibold mb-4">Response Time</h3>
            <p className="text-foreground/70">
              We typically respond to inquiries within 6 hours. For urgent issues, please open a GitHub issue in our
              main repository.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
