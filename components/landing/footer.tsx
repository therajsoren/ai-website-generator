"use client";

import Link from "next/link";
import { Sparkles, ExternalLink } from "lucide-react";
import { FaLinkedinIn, FaGithub, FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <footer>
      <div className="bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
            <div className="max-w-md">
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-sm mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Contact Us</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-6 leading-snug">
                Interested in working together,{" "}
                <span className="text-slate-500 dark:text-slate-400">
                  trying out the platform or simply learning more?
                </span>
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Contact Us at:
                </p>
                <a
                  href="mailto:hello@venn.ai"
                  className="inline-flex items-center gap-2 text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  hello@venn.ai
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <nav className="flex flex-wrap gap-8 text-sm flex-col">
              <Link
                href="#features"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Testimonials
              </Link>
              <Link
                href="/login"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Login
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="bg-slate-200 dark:bg-slate-950 text-slate-900 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 py-12 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-sm text-slate-500 dark:text-slate-500 order-2 md:order-1">
              © {new Date().getFullYear()} Venn. All rights reserved.
            </p>

            <div className="flex items-center gap-4 order-1 md:order-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-slate-800 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-slate-800 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-slate-800 transition-colors"
                aria-label="X"
              >
                <FaXTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
