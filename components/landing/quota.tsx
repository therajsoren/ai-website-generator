"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Zap, Clock, TrendingUp, Check } from "lucide-react";

const quotaFeatures = [
  {
    icon: MessageSquare,
    title: "25 AI Messages / Day",
    description:
      "Generate prompts, refine content, and chat with our AI assistant.",
  },
  {
    icon: Zap,
    title: "2 Heavy Generations / Day",
    description:
      "Full website generation, complex layouts, and multi-page builds.",
  },
  {
    icon: Clock,
    title: "Daily Reset",
    description:
      "Quotas automatically reset every 24 hours. No rollover limits.",
  },
  {
    icon: TrendingUp,
    title: "Usage Dashboard",
    description: "Real-time tracking of your usage with visual progress bars.",
  },
];

const includedFeatures = [
  "AI-powered website generation",
  "Code export (HTML, CSS, React)",
  "Dark & light mode themes",
  "Responsive designs",
  "Component library access",
  "Community support",
];

export function Quota() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="quota" className="py-24 px-6 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4">
            USAGE LIMITS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Fair usage for everyone
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Generous daily quotas that reset automatically
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div ref={ref} className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left - Quota Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {quotaFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Right - Free Tier Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-8 text-white"
          >
            <div className="mb-6">
              <span className="text-violet-200 text-sm font-medium">
                FREE TIER
              </span>
              <h3 className="text-3xl font-bold mt-2">$0 / month</h3>
              <p className="text-violet-200 mt-2">
                Everything you need to get started
              </p>
            </div>

            {/* Progress Bars Preview */}
            <div className="space-y-4 mb-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>AI Messages</span>
                  <span>12/25 used</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-[48%] bg-white rounded-full transition-all" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Heavy Generations</span>
                  <span>1/2 used</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-[50%] bg-white rounded-full transition-all" />
                </div>
              </div>
              <p className="text-xs text-violet-200 text-center">
                🔄 Resets in 12 hours
              </p>
            </div>

            {/* Features List */}
            <ul className="space-y-3">
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-violet-200 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
