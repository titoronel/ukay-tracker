"use client";

import { Bundle, Item } from "@/types";
import { calculateBundleStats, calculateDailyProfit, downloadInventoryCsv, formatCurrency, getLocalDateString } from "@/lib/utils";
import { Package, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export const Dashboard = ({
  bundles,
  items,
}: {
  bundles: Bundle[];
  items: Item[];
}) => {
  const today = getLocalDateString();
  const todayItems = items.filter(
    (item) => item.status === "Sold" && item.soldDate === today
  );
  const todaySales = todayItems.reduce(
    (sum, item) => sum + (item.soldPrice || 0),
    0
  );
  const todayProfit = calculateDailyProfit(today, bundles, items);

  const bundleStatsMap = new Map<string, ReturnType<typeof calculateBundleStats>>();

  bundles.forEach((bundle) => {
    const stats = calculateBundleStats(bundle, items);
    bundleStatsMap.set(bundle.id, stats);
  });

  const activeBundles = bundles.length;
  const breakevenBundles = bundles.filter(
    (bundle) => bundleStatsMap.get(bundle.id)?.isBreakeven
  ).length;

  const stats = [
    { label: "Today's Sales", value: formatCurrency(todaySales), color: "bg-emerald-500" },
    { label: "Today's Profit", value: formatCurrency(todayProfit), color: "bg-accent" },
    { label: "Active Bundles", value: activeBundles.toString(), color: "bg-blue-500" },
    { label: "Breakeven", value: breakevenBundles.toString(), color: "bg-amber-500" },
  ];

  const handleExport = () => {
    if (bundles.length === 0 && items.length === 0) {
      toast.error("Nothing to export yet");
      return;
    }
    downloadInventoryCsv(bundles, items);
    toast.success("Inventory CSV downloaded");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Today in Philippine time</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="shrink-0">
          <Download className="w-4 h-4 mr-1.5" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-card border border-border rounded-xl p-4 sm:p-5 transition-colors duration-150 hover:bg-muted/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${stat.color}`} />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Bundles</h2>
        <div className="space-y-3">
          {bundles.map((bundle) => {
            const stats = bundleStatsMap.get(bundle.id);
            if (!stats) return null;
            const bundleItems = items.filter((item) => item.bundleId === bundle.id);

            return (
              <div
                key={bundle.id}
                className="bg-card border border-border rounded-xl p-4 sm:p-5 transition-colors duration-150 hover:border-border/80"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {bundle.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {bundle.category} · {bundle.totalPieces} pieces · {bundleItems.length} added
                    </p>
                  </div>
                  {stats.isBreakeven && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Breakeven
                    </span>
                  )}
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

          {bundles.length === 0 && (
            <div className="bg-card border border-border border-dashed rounded-xl p-12 text-center">
              <Package className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No bundles yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Create your first bundle to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
