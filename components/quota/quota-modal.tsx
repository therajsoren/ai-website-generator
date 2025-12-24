"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Zap, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  quota: {
    messages: { used: number; total: number };
    generations: { used: number; total: number };
    resetTime: string;
  };
}

export function QuotaModal({ isOpen, onClose, quota }: QuotaModalProps) {
  if (!isOpen) return null;

  const messagesPercent = (quota.messages.used / quota.messages.total) * 100;
  const generationsPercent =
    (quota.generations.used / quota.generations.total) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Usage Details
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        AI Messages
                      </span>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {quota.messages.used} / {quota.messages.total}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${messagesPercent}%` }}
                      className={`h-full rounded-full ${
                        messagesPercent >= 100
                          ? "bg-red-500"
                          : messagesPercent >= 80
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        Heavy Generations
                      </span>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {quota.generations.used} / {quota.generations.total}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${generationsPercent}%` }}
                      className={`h-full rounded-full ${
                        generationsPercent >= 100
                          ? "bg-red-500"
                          : generationsPercent >= 80
                          ? "bg-amber-500"
                          : "bg-violet-500"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-sm">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Next reset:{" "}
                    <span className="font-medium text-slate-900 dark:text-white">
                      {quota.resetTime}
                    </span>
                  </span>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Button
                  onClick={onClose}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Got it
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export async function getQuota(): Promise<{
  messages: { used: number; total: number };
  generations: { used: number; total: number };
  resetTime: string;
}> {
  return {
    messages: { used: 12, total: 25 },
    generations: { used: 1, total: 2 },
    resetTime: "12 hours",
  };
}

export async function updateQuota(
  type: "message" | "generation"
): Promise<boolean> {
  console.log(`Updating quota for ${type}`);
  return true;
}

export async function resetQuota(): Promise<boolean> {
  console.log("Resetting quota");
  return true;
}
