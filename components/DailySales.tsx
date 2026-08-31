"use client";

import { useState } from "react";
import { Bundle, Item, DailySale } from "@/types";
import { formatCurrency, calculateDailyProfit, getLocalDateString } from "@/lib/utils";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";

export const DailySales = ({
  items,
  bundles,
  dailySales, // eslint-disable-line @typescript-eslint/no-unused-vars
  onAddSale, // eslint-disable-line @typescript-eslint/no-unused-vars
  onDeleteSale, // eslint-disable-line @typescript-eslint/no-unused-vars
  refresh, // eslint-disable-line @typescript-eslint/no-unused-vars
}: {
  items: Item[];
  bundles: Bundle[];
  dailySales: DailySale[];
  onAddSale: (sale: DailySale) => Promise<void>;
  onDeleteSale: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}) => {
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());

  const getBundleName = (bundleId: string) => bundles.find((b) => b.id === bundleId)?.name || "Unknown";

  const getDailyStats = (date: string) => {
    const daySales = items.filter((item) => item.status === "Sold" && item.soldDate === date);
    const revenue = daySales.reduce((sum, item) => sum + (item.soldPrice || 0), 0);
    const profit = calculateDailyProfit(date, bundles, items);

    const bundleSales = new Map<string, { revenue: number; count: number }>();

    daySales.forEach((item) => {
      const bundle = bundles.find((b) => b.id === item.bundleId);
      if (bundle) {
        const current = bundleSales.get(bundle.id) || { revenue: 0, count: 0 };
        bundleSales.set(bundle.id, {
          revenue: current.revenue + (item.soldPrice || 0),
          count: current.count + 1,
        });
      }
    });

    return { sales: daySales, revenue, profit, bundleSales };
  };

  const stats = getDailyStats(selectedDate);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Daily Sales</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track your daily performance</p>
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-9 pr-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-150"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-success" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{formatCurrency(stats.revenue)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.sales.length} {stats.sales.length === 1 ? "item" : "items"} sold
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Profit</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{formatCurrency(stats.profit)}</p>
          <p className="text-xs text-muted-foreground mt-1">Surplus after remaining bundle cost</p>
        </div>
      </div>

      {stats.bundleSales.size > 0 && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Bundle Performance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from(stats.bundleSales.entries()).map(([bundleId, data]) => {
              const bundle = bundles.find((b) => b.id === bundleId);
              if (!bundle) return null;
              return (
                <div key={bundleId} className="bg-card border border-border rounded-xl p-4">
                  <h3 className="text-sm font-medium text-foreground truncate">{bundle.name}</h3>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-muted-foreground">Revenue</span>
                    <span className="text-sm font-semibold text-success">{formatCurrency(data.revenue)}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Items</span>
                    <span className="text-sm font-medium text-foreground">{data.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Sales Detail</h2>
        {stats.sales.length > 0 ? (
          <div className="space-y-2">
            {stats.sales.map((item) => (
              <div key={item.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{getBundleName(item.bundleId)}</p>
                  <div className="flex gap-1.5 mt-1.5">
                    <span className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-md">{item.size}</span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-md">{item.condition}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-semibold text-success">{formatCurrency(item.soldPrice || 0)}</p>
                  {item.sellingPrice !== item.soldPrice && (
                    <p className="text-xs text-muted-foreground line-through">{formatCurrency(item.sellingPrice)}</p>
                  )}
                  {item.soldNotes && (
                    <p className="text-xs text-muted-foreground mt-1 max-w-[12rem] truncate">{item.soldNotes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border border-dashed rounded-xl p-12 text-center">
            <Calendar className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No sales recorded for {selectedDate}</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Mark items as sold from the Items tab</p>
          </div>
        )}
      </div>
    </div>
  );
};
