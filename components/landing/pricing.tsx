"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out our AI builder.",
    features: [
      "3 Projects",
      "Basic AI Generation",
      "Community Support",
      "Code Export",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    description: "For professionals and serious builders.",
    features: [
      "Unlimited Projects",
      "Advanced AI Models",
      "Priority Support",
      "Custom Domains",
      "Team Collaboration",
      "API Access",
    ],
    cta: "Upgrade to Pro",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "For large teams and organizations.",
    features: [
      "Everything in Pro",
      "Dedicated Account Manager",
      "SSO & Security",
      "Custom Integrations",
      "SLA Guarantee",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

export function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-24 px-6 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium mb-4">
            PRICING
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Choose the plan that's right for you
          </p>
        </motion.div>

        {/* Cards */}
        <div ref={ref} className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className={`relative p-8 rounded-2xl border ${
                plan.featured
                  ? "border-orange-400 bg-gradient-to-b from-orange-50 to-white dark:from-orange-900/20 dark:to-slate-800 shadow-lg"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-400 text-white text-sm font-medium rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                  {plan.price}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  /month
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/signup">
                <Button
                  className={`w-full rounded-full ${
                    plan.featured
                      ? "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
