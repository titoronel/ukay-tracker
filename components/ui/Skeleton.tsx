"use client";

import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-muted", className)}
      {...props}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 sm:p-5">
            <Skeleton className="h-3 w-20 rounded mb-3" />
            <Skeleton className="h-8 w-24 rounded" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 sm:p-5">
            <Skeleton className="h-5 w-32 rounded mb-2" />
            <Skeleton className="h-3 w-48 rounded mb-4" />
            <div className="grid grid-cols-3 gap-3 mb-3">
              <Skeleton className="h-12 rounded" />
              <Skeleton className="h-12 rounded" />
              <Skeleton className="h-12 rounded" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DailySalesSkeleton() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <Skeleton className="h-4 w-20 rounded mb-3" />
          <Skeleton className="h-8 w-28 rounded" />
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <Skeleton className="h-4 w-20 rounded mb-3" />
          <Skeleton className="h-8 w-28 rounded" />
        </div>
      </div>
    </div>
  );
}