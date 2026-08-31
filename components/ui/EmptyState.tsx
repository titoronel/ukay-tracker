"use client";

import { cn } from "@/lib/utils";
import { Package, Shirt, DollarSign, Search } from "lucide-react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("bg-card border border-border border-dashed rounded-xl p-12 text-center", className)}>
      <div className="text-muted-foreground/50 flex justify-center mb-3">{icon}</div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground/60 mt-1 mb-4">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-150"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function EmptyBundleState({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      icon={<Package className="w-10 h-10" />}
      title="No bundles yet"
      description="Create your first bundle to start tracking inventory and profits"
      action={{ label: "Create Bundle", onClick: onCreate }}
    />
  );
}

export function EmptyItemState({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon={<Shirt className="w-10 h-10" />}
      title="No items yet"
      description="Add items to your bundles to start tracking individual pieces"
      action={{ label: "Add Item", onClick: onAdd }}
    />
  );
}

export function EmptySalesState({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon={<DollarSign className="w-10 h-10" />}
      title="No sales recorded"
      description="Mark items as sold from the Items tab to track daily sales and profits"
      action={{ label: "Record Sale", onClick: onAdd }}
    />
  );
}

export function EmptySearchState({ onClear }: { onClear: () => void }) {
  return (
    <EmptyState
      icon={<Search className="w-10 h-10" />}
      title="No results found"
      description="Try adjusting your search or filters"
      action={{ label: "Clear filters", onClick: onClear }}
    />
  );
}

export function EmptyAnalyticsState({ onNavigate }: { onNavigate: () => void }) {
  return (
    <EmptyState
      icon={<DollarSign className="w-10 h-10" />}
      title="Not enough data"
      description="Add bundles and record sales to see analytics and insights"
      action={{ label: "Go to Dashboard", onClick: onNavigate }}
    />
  );
}