"use client";

import { Bundle, Item } from "@/types";
import { calculateBundleStats, formatCurrency } from "@/lib/utils";
import { Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { EmptyBundleState } from "@/components/ui/EmptyState";

export const BundleList = ({
  bundles,
  items,
  onEdit,
  onDelete,
  onCreate,
}: {
  bundles: Bundle[];
  items: Item[];
  onEdit: (bundle: Bundle) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}) => {
  if (bundles.length === 0) {
    return <EmptyBundleState onCreate={onCreate} />;
  }

  return (
    <div className="space-y-3">
      {bundles.map((bundle) => {
        const stats = calculateBundleStats(bundle, items);
        const bundleItems = items.filter((item) => item.bundleId === bundle.id);

        return (
          <div
            key={bundle.id}
            className="bg-card border border-border rounded-xl p-4 sm:p-5 transition-colors duration-150 hover:border-border/80"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground truncate">
                  {bundle.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {bundle.category} · {bundle.totalPieces} pieces · {bundleItems.length} items added
                </p>
              </div>
              <div className="flex items-center gap-1 ml-3">
                {stats.isBreakeven && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full mr-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Breakeven
                  </span>
                )}
                <button
                  onClick={() => onEdit(bundle)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(bundle.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors duration-150"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Cost</p>
                <p className="text-sm font-semibold text-foreground">{formatCurrency(bundle.totalCost)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Sales</p>
                <p className="text-sm font-semibold text-success">{formatCurrency(stats.totalSales)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  {stats.isBreakeven ? "Profit" : "Remaining"}
                </p>
                <p className={`text-sm font-semibold ${stats.isBreakeven ? "text-success" : "text-foreground"}`}>
                  {formatCurrency(stats.isBreakeven ? stats.profit : stats.remainingToBreakeven)}
                </p>
              </div>
            </div>

            <div className="relative w-full bg-muted rounded-full h-1.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  stats.isBreakeven ? "bg-success" : "bg-accent"
                }`}
                style={{ width: `${stats.progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {stats.isBreakeven ? "Cost recovered" : `${stats.progressPercent.toFixed(1)}% recovered`}
            </p>
          </div>
        );
      })}
    </div>
  );
};
