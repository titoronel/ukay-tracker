"use client";

import { Bundle, Item } from "@/types";
import { calculateBundleStats, formatCurrency } from "@/lib/utils";

export const Dashboard = ({
  bundles,
  items,
}: {
  bundles: Bundle[];
  items: Item[];
}) => {
  const today = new Date().toISOString().split("T")[0];
  const todayItems = items.filter(
    (item) => item.status === "Sold" && item.soldDate === today
  );
  const todaySales = todayItems.reduce(
    (sum, item) => sum + (item.soldPrice || 0),
    0
  );

  let todayProfit = 0;
  const bundleStatsMap = new Map<
    string,
    ReturnType<typeof calculateBundleStats>
  >();

  bundles.forEach((bundle) => {
    const stats = calculateBundleStats(bundle, items);
    bundleStatsMap.set(bundle.id, stats);

    todayItems.forEach((item) => {
      if (item.bundleId === bundle.id && stats.isBreakeven) {
        const costPerItem = bundle.totalCost / bundle.totalPieces;
        const profitFromItem = (item.soldPrice || 0) - costPerItem;
        if (profitFromItem > 0) todayProfit += profitFromItem;
      }
    });
  });

  const activeBundles = bundles.length;
  const breakevenBundles = bundles.filter(
    (bundle) => bundleStatsMap.get(bundle.id)?.isBreakeven
  ).length;

  return (
    <div className="space-y-4 sm:space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          {
            label: "Today's Sales",
            value: formatCurrency(todaySales),
            icon: "💵",
            gradient: "from-emerald-400 to-teal-500",
            glow: "emerald",
          },
          {
            label: "Today's Profit",
            value: formatCurrency(todayProfit),
            icon: "💰",
            gradient: "from-blue-400 to-indigo-500",
            glow: "blue",
          },
          {
            label: "Active Bundles",
            value: activeBundles,
            icon: "📦",
            gradient: "from-purple-400 to-pink-500",
            glow: "purple",
          },
          {
            label: "Breakeven",
            value: breakevenBundles,
            icon: "✨",
            gradient: "from-amber-400 to-orange-500",
            glow: "amber",
          },
        ].map((stat, idx) => (
          <div key={idx} className="group relative">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-xl sm:rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`}
            />
            <div className="relative bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <span className="text-xl sm:text-3xl animate-bounce-slow">
                  {stat.icon}
                </span>
              </div>
              <p
                className={`text-xl sm:text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
              >
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl sm:rounded-3xl blur-2xl" />
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/50">
          <h2 className="text-xl sm:text-3xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Bundle Overview
          </h2>
          <div className="space-y-6">
            {bundles.map((bundle) => {
              const stats = bundleStatsMap.get(bundle.id);
              if (!stats) return null;

              return (
                <div key={bundle.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-purple-300 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
                          {bundle.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {bundle.category} • {bundle.totalPieces} pieces
                        </p>
                      </div>
                      {stats.isBreakeven && (
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-green-400 rounded-full blur-md animate-pulse" />
                          <span className="relative bg-gradient-to-r from-green-400 to-emerald-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg">
                            ✓ Breakeven
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div className="bg-white/70 rounded-lg sm:rounded-xl p-2 sm:p-4 backdrop-blur-sm">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Cost</p>
                        <p className="text-sm sm:text-lg font-bold text-gray-800">
                          {formatCurrency(bundle.totalCost)}
                        </p>
                      </div>
                      <div className="bg-white/70 rounded-lg sm:rounded-xl p-2 sm:p-4 backdrop-blur-sm">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Sales</p>
                        <p className="text-sm sm:text-lg font-bold text-green-600">
                          {formatCurrency(stats.totalSales)}
                        </p>
                      </div>
                      <div className="bg-white/70 rounded-lg sm:rounded-xl p-2 sm:p-4 backdrop-blur-sm">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">
                          {stats.isBreakeven ? "Profit" : "Remaining"}
                        </p>
                        <p
                          className={`text-sm sm:text-lg font-bold ${
                            stats.isBreakeven
                              ? "text-emerald-600"
                              : "text-orange-500"
                          }`}
                        >
                          {formatCurrency(
                            stats.isBreakeven
                              ? stats.profit
                              : stats.remainingToBreakeven
                          )}
                        </p>
                      </div>
                      <div className="bg-white/70 rounded-lg sm:rounded-xl p-2 sm:p-4 backdrop-blur-sm">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Unsold</p>
                        <p className="text-sm sm:text-lg font-bold text-purple-600">
                          {stats.unsoldCount}
                        </p>
                      </div>
                    </div>

                    <div className="relative w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          stats.isBreakeven
                            ? "bg-gradient-to-r from-green-400 to-emerald-500"
                            : "bg-gradient-to-r from-blue-400 to-purple-500"
                        }`}
                        style={{ width: `${stats.progressPercent}%` }}
                      >
                        <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                      </div>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-1 sm:mt-2 font-semibold">
                      {stats.progressPercent.toFixed(1)}% recovered
                    </p>
                  </div>
                </div>
              );
            })}

            {bundles.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 animate-bounce-slow">📦</div>
                <p className="text-xl text-gray-500 font-semibold">
                  No bundles yet
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Create your first bundle to get started!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
