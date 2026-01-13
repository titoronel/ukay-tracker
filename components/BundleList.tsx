"use client";

import { Bundle, Item } from "@/types";
import { calculateBundleStats, formatCurrency } from "@/lib/utils";

export const BundleList = ({
  bundles,
  items,
  onEdit,
  onDelete,
}: {
  bundles: Bundle[];
  items: Item[];
  onEdit: (bundle: Bundle) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="space-y-6">
      {bundles.map((bundle, idx) => {
        const stats = calculateBundleStats(bundle, items);
        const bundleItems = items.filter((item) => item.bundleId === bundle.id);

        return (
          <div
            key={bundle.id}
            className="group relative animate-fadeIn"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-800">
                    {bundle.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">
                    {bundle.category} • {bundle.totalPieces} pieces •{" "}
                    {bundleItems.length} items added
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(bundle)}
                    className="relative group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                    <div className="relative bg-white px-4 py-2 rounded-lg text-sm font-bold text-blue-600 hover:text-purple-600 transition-colors">
                      ✏️ Edit
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this bundle and all its items?"
                        )
                      ) {
                        onDelete(bundle.id);
                      }
                    }}
                    className="relative group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                    <div className="relative bg-white px-4 py-2 rounded-lg text-sm font-bold text-red-600 hover:text-pink-600 transition-colors">
                      🗑️ Delete
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Cost",
                    value: formatCurrency(bundle.totalCost),
                    gradient: "from-orange-400 to-red-500",
                  },
                  {
                    label: "Sales",
                    value: formatCurrency(stats.totalSales),
                    gradient: "from-green-400 to-emerald-500",
                  },
                  {
                    label: "Unsold",
                    value: stats.unsoldCount,
                    gradient: "from-purple-400 to-pink-500",
                  },
                  {
                    label: stats.isBreakeven ? "Profit" : "Remaining",
                    value: formatCurrency(
                      stats.isBreakeven
                        ? stats.profit
                        : stats.remainingToBreakeven
                    ),
                    gradient: stats.isBreakeven
                      ? "from-emerald-400 to-teal-500"
                      : "from-amber-400 to-orange-500",
                  },
                ].map((stat, i) => (
                  <div key={i} className="relative group/card">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-xl blur opacity-30 group-hover/card:opacity-50 transition-opacity`}
                    />
                    <div className="relative bg-white/70 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-xs text-gray-500 mb-1 font-semibold">
                        {stat.label}
                      </p>
                      <p
                        className={`text-lg font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                      >
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    stats.isBreakeven
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : "bg-gradient-to-r from-blue-400 to-purple-500"
                  }`}
                  style={{ width: `${stats.progressPercent}%` }}
                >
                  <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-600 font-bold">
                  {stats.isBreakeven ? (
                    <span className="text-green-600">
                      🎉 Breakeven reached!
                    </span>
                  ) : (
                    `${stats.progressPercent.toFixed(1)}% of cost recovered`
                  )}
                </p>
                {stats.isBreakeven && (
                  <span className="text-xs bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full font-bold animate-pulse">
                    ✨ PROFIT MODE
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {bundles.length === 0 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
          <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-16 text-center border border-white/50">
            <div className="text-8xl mb-6 animate-bounce-slow">📦</div>
            <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              No bundles yet
            </p>
            <p className="text-gray-500 font-medium">
              Create your first bundle to start tracking inventory
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
