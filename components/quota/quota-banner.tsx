"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, Clock } from "lucide-react";

type BannerState = "info" | "warn" | "error" | "hidden";

interface QuotaBannerProps {
  usagePercent: number;
  quotaType?: string;
}

export function QuotaBanner({
  usagePercent,
  quotaType = "AI messages",
}: QuotaBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  const getState = (): BannerState => {
    if (usagePercent >= 100) return "error";
    if (usagePercent >= 80) return "warn";
    if (usagePercent >= 60) return "info";
    return "hidden";
  };

  const state = getState();

  if (state === "hidden" || dismissed) return null;

  const styles = {
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    warn: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200",
    error:
      "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
    hidden: "",
  };

  const messages = {
    info: `You've used ${usagePercent}% of your daily ${quotaType}.`,
    warn: `Warning: ${usagePercent}% of your daily ${quotaType} used.`,
    error: `You've reached your daily ${quotaType} limit. Resets at midnight.`,
    hidden: "",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-16 left-0 right-0 z-40 border-b ${styles[state]}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{messages[state]}</span>
            {state === "error" && (
              <span className="flex items-center gap-1 text-xs opacity-80">
                <Clock className="w-3 h-3" />
                Resets in 6 hours
              </span>
            )}
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
