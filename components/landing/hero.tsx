"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Code2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="min-h-screen pt-32 pb-20 px-6 bg-gradient-to-b from-amber-50 via-orange-50/50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm mb-8"
        >
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span className="text-sm text-slate-600 dark:text-slate-300">
            AI-Powered Website Builder
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6"
        >
          Build websites
          <br />
          <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            10x faster
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10"
        >
          Transform your ideas into stunning, production-ready websites in
          minutes. No coding required.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/signup">
            <Button className="h-14 px-8 text-lg rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 shadow-lg">
              Start Building Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="#features">
            <Button
              variant="outline"
              className="h-14 px-8 text-lg rounded-full border-slate-300 dark:border-slate-600"
            >
              See How It Works
            </Button>
          </Link>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {[
            { icon: Zap, label: "Lightning Fast" },
            { icon: Code2, label: "Clean Code" },
            { icon: Palette, label: "Beautiful Design" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700"
            >
              <item.icon className="w-4 h-4 text-violet-500" />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
