"use client"

import { CheckCircle, Code, Lock, Eye } from "lucide-react"

export function TrustSection() {
  const features = [
    {
      icon: Code,
      title: "100% Open Source",
      description: "Our entire codebase is available on GitHub. Audit and verify everything.",
      link: "View on GitHub",
    },
    {
      icon: Lock,
      title: "No-Logs Policy",
      description: "We don't store, track, or sell your data. Our policy is independently audited annually.",
      link: "Read Full Policy",
    },
    {
      icon: Eye,
      title: "Transparent",
      description: "See exactly what happens at every step. Connection flows, encryption details, everything visible.",
      link: "See Example",
    },
  ]

  return (
    <section className="py-16 bg-white dark:bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why SiteVPN Exists?</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            With SiteVPN, you can use your favorite AI tools freely — no limits, no restrictions, and no worrying about credits out.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border hover:border-primary/50 transition-colors group"
              >
                <Icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-foreground/60 text-sm mb-4">{feature.description}</p>
                <button className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                  {feature.link} →
                </button>
              </div>
            )
          })}
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 dark:border-primary/30 rounded-xl p-8">
          <h3 className="text-center text-2xl md:text-3xl font-bold text-foreground mb-8">
            How It Works
          </h3>

          <ul className="space-y-6">
            {/* Step 1 */}
            <li className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 
                      flex items-center justify-center text-primary font-bold shadow-sm">
                1
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Click Start</h4>
                <p className="text-sm text-foreground/60">
                  No sign-up required initially. Begin instantly.
                </p>
              </div>
            </li>

            {/* Step 2 */}
            <li className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 
                      flex items-center justify-center text-primary font-bold shadow-sm">
                2
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Select Service</h4>
                <p className="text-sm text-foreground/60">
                  Choose VPN, Temporary Email, Temporary Number, or Browser Privacy.
                </p>
              </div>
            </li>

            {/* Step 3 */}
            <li className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 
                      flex items-center justify-center text-primary font-bold shadow-sm">
                3
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Use Immediately</h4>
                <p className="text-sm text-foreground/60">
                  Your secure session or private credentials are ready instantly.
                </p>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </section>
  )
}
