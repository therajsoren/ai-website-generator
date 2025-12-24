"use client";

import { useState } from "react";
import { Zap } from "lucide-react";

interface QuotaIndicatorProps {
  used: number;
  total: number;
}

export function QuotaIndicator({ used, total }: QuotaIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const remaining = total - used;
  const percent = (used / total) * 100;

  const getColor = () => {
    if (percent >= 100) return "bg-red-500 text-red-50";
    if (percent >= 80) return "bg-amber-500 text-amber-50";
    return "bg-violet-500 text-violet-50";
  };

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getColor()} transition-colors`}
      >
        <Zap className="w-3 h-3" />
        {remaining}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50">
          <div className="font-medium mb-1">Daily Quota</div>
          <div className="text-slate-300">
            {remaining} of {total} remaining
          </div>
          <div className="text-slate-400 text-[10px] mt-1">
            Resets at midnight
          </div>
          {/* Arrow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45" />
        </div>
      )}
    </div>
  );
}
