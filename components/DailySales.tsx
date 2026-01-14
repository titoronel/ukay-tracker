"use client";

import { useState } from "react";
import { Bundle, Item, DailySale } from "@/types";
import { formatCurrency } from "@/lib/utils";

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
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const getBundleName = (bundleId: string) => {
    const bundle = bundles.find((b) => b.id === bundleId);
    return bundle?.name || "Unknown Bundle";
  };

  const getDailyStats = (date: string) => {
    const daySales = items.filter(
      (item) => item.status === "Sold" && item.soldDate === date
    );
    const revenue = daySales.reduce(
      (sum, item) => sum + (item.soldPrice || 0),
      0
    );

    let profit = 0;
    const bundleSales = new Map<string, { revenue: number; count: number }>();

    daySales.forEach((item) => {
      const bundle = bundles.find((b) => b.id === item.bundleId);
      if (bundle) {
        const current = bundleSales.get(bundle.id) || { revenue: 0, count: 0 };
        bundleSales.set(bundle.id, {
          revenue: current.revenue + (item.soldPrice || 0),
          count: current.count + 1,
        });

        const allSoldItems = items.filter(
          (i) =>
            i.bundleId === bundle.id &&
            i.status === "Sold" &&
            i.soldDate &&
            i.soldDate <= date
        );
        const totalRevenue = allSoldItems.reduce(
          (sum, i) => sum + (i.soldPrice || 0),
          0
        );

        if (totalRevenue > bundle.totalCost) {
          const costPerItem = bundle.totalCost / bundle.totalPieces;
          const itemsBeforeBreakeven = allSoldItems.filter(
            (i) => i.soldDate && i.soldDate < date
          );
          const revenueBefore = itemsBeforeBreakeven.reduce(
            (sum, i) => sum + (i.soldPrice || 0),
            0
          );

          if (revenueBefore >= bundle.totalCost) {
            profit += (item.soldPrice || 0) - costPerItem;
          } else {
            const remainingCost = bundle.totalCost - revenueBefore;
            if ((item.soldPrice || 0) > remainingCost) {
              profit += (item.soldPrice || 0) - remainingCost;
            }
          }
        }
      }
    });

    return { sales: daySales, revenue, profit, bundleSales };
  };

  const stats = getDailyStats(selectedDate);

  return (
    <div className="space-y-4 sm:space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Daily Sales
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 font-medium">
            Track your daily performance
          </p>
        </div>
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-lg sm:rounded-xl blur-lg" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="relative w-full sm:w-auto px-3 sm:px-5 py-2 sm:py-3 border-2 border-amber-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 bg-white/90 backdrop-blur-sm font-bold text-gray-800 shadow-lg text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl sm:rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-white/50 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <p className="text-[10px] sm:text-sm font-bold text-gray-600 uppercase tracking-wide">
                Revenue for {selectedDate}
              </p>
              <span className="text-2xl sm:text-4xl animate-bounce-slow">💵</span>
            </div>
            <p className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 sm:mb-3">
              {formatCurrency(stats.revenue)}
            </p>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-xs sm:text-sm text-gray-600 font-semibold">
                {stats.sales.length}{" "}
                {stats.sales.length === 1 ? "item" : "items"} sold
              </p>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl sm:rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-white/50 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <p className="text-[10px] sm:text-sm font-bold text-gray-600 uppercase tracking-wide">
                Profit for {selectedDate}
              </p>
              <span className="text-2xl sm:text-4xl animate-bounce-slow">💰</span>
            </div>
            <p className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-3">
              {formatCurrency(stats.profit)}
            </p>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse" />
              <p className="text-xs sm:text-sm text-gray-600 font-semibold">
                After breakeven costs recovered
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bundle Performance */}
      {stats.bundleSales.size > 0 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl sm:rounded-3xl blur-2xl" />
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/50">
            <h2 className="text-lg sm:text-2xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              📊 Bundle Performance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from(stats.bundleSales.entries()).map(
                ([bundleId, data], idx) => {
                  const bundle = bundles.find((b) => b.id === bundleId);
                  if (!bundle) return null;

                  return (
                    <div
                      key={bundleId}
                      className="relative group animate-fadeIn"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl sm:rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                      <div className="relative bg-gradient-to-br from-white to-purple-50/30 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-purple-200 hover:border-purple-400 transition-all duration-300">
                        <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-2 truncate">
                          {bundle.name}
                        </h3>
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] sm:text-xs text-gray-600 font-semibold">
                              Revenue:
                            </span>
                            <span className="text-xs sm:text-sm font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                              {formatCurrency(data.revenue)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] sm:text-xs text-gray-600 font-semibold">
                              Items sold:
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-purple-600">
                              {data.count}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sales Detail */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl sm:rounded-3xl blur-2xl" />
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/50">
          <h2 className="text-lg sm:text-2xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            📝 Sales Detail
          </h2>

          {stats.sales.length > 0 ? (
            <div className="space-y-2 sm:space-y-4">
              {stats.sales.map((item, idx) => (
                <div
                  key={item.id}
                  className="group relative animate-fadeIn"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl sm:rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative bg-gradient-to-br from-white to-amber-50/30 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-amber-200 hover:border-amber-400 transition-all duration-300">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-xl font-bold text-gray-800 truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                          {getBundleName(item.bundleId)}
                        </p>
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
                          <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-bold">
                            📏 {item.size}
                          </span>
                          <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-bold">
                            {item.condition === "As New" && "✨"}
                            {item.condition === "Excellent" && "⭐"}
                            {item.condition === "Good" && "👍"}
                            {item.condition === "With Issue" && "⚠️"}
                            {item.condition === "Reject" && "❌"}{" "}
                            {item.condition}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg sm:rounded-xl blur opacity-50" />
                          <p className="relative text-xl sm:text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {formatCurrency(item.soldPrice || 0)}
                          </p>
                        </div>
                        {item.sellingPrice !== item.soldPrice && (
                          <p className="text-xs sm:text-sm text-gray-500 line-through mt-1 font-medium">
                            List: {formatCurrency(item.sellingPrice)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-16">
              <div className="text-5xl sm:text-8xl mb-4 sm:mb-6 animate-bounce-slow">📭</div>
              <p className="text-xl sm:text-2xl font-black text-gray-600 mb-2">
                No sales recorded for {selectedDate}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Mark items as sold from the Items tab to track daily sales
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
