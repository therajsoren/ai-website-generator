"use client";

export function QuotaSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>

      {/* Progress Bars Skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
      </div>

      {/* Timer Skeleton */}
      <div className="flex justify-center">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  );
}

export function QuotaCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    </div>
  );
}

export function QuotaIndicatorSkeleton() {
  return (
    <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
  );
}
