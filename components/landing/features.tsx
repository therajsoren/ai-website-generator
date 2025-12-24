"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Code2, Smartphone, Shield, Wand2, Moon } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate complete websites in seconds, not hours. AI processes your prompts instantly.",
  },
  {
    icon: Code2,
    title: "Production-Ready Code",
    description:
      "Export clean HTML, CSS, and React components. No cleanup needed.",
  },
  {
    icon: Smartphone,
    title: "Fully Responsive",
    description:
      "Every design adapts perfectly across desktop, tablet, and mobile devices.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Your data stays private. SOC 2 compliant with enterprise-grade protection.",
  },
  {
    icon: Wand2,
    title: "AI-Powered Generation",
    description:
      "Describe what you want and watch your website come to life with AI magic.",
  },
  {
    icon: Moon,
    title: "Dark & Light Themes",
    description:
      "Every generated site supports both dark and light modes out of the box.",
  },
];

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 px-6 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4">
            CAPABILITIES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything you need to build faster
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            From idea to production in minutes, not months
          </p>
        </motion.div>

        {/* Grid */}
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-violet-200 dark:hover:border-violet-800 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-5">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
