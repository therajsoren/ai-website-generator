"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-amber-50/80 dark:bg-slate-900/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center"
            whileHover={{ rotate: 10 }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </motion.div>
          <span className="font-bold text-lg text-slate-800 dark:text-white">
            Venn
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}
          <Link href="/login">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex text-slate-600 dark:text-slate-300"
            >
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 px-5">
              GO TO APP
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
