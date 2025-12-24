"use client";

import { useAuth } from "@/lib/auth-context";

export function DashboardHeader() {
  const { user } = useAuth();

  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-end sticky top-0 z-40">
      <div className="w-9 h-9 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-medium cursor-pointer text-sm">
        {userInitials}
      </div>
    </header>
  );
}
