"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Designer",
    company: "Figma",
    quote:
      "This tool has completely transformed my workflow. I can prototype and iterate on ideas 10x faster than before.",
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "Founder",
    company: "TechStart",
    quote:
      "I built my entire landing page in 30 minutes. The code quality is surprisingly production-ready.",
    avatar: "MJ",
  },
  {
    name: "Emily Davis",
    role: "Senior Developer",
    company: "Stripe",
    quote:
      "Finally, an AI builder that gives me clean code I can actually understand and customize.",
    avatar: "ED",
  },
];

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="testimonials"
      className="py-24 px-6 bg-gradient-to-b from-orange-50 to-white dark:from-slate-800 dark:to-slate-900"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium mb-4">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Loved by builders worldwide
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            See what our users are saying
          </p>
        </motion.div>

        {/* Cards */}
        <div ref={ref} className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-orange-200 dark:text-orange-800" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-orange-400 text-orange-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                "{item.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-semibold text-sm">
                  {item.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.role} @ {item.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
