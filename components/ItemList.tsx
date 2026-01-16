"use client";

import { Item, Bundle } from "@/types";
import { formatCurrency } from "@/lib/utils";

export const ItemList = ({
  items,
  bundles,
  onEdit,
  onDelete,
  onUpdateItem,
  showAvailable = true,
  showSold = true,
  availableItems,
  soldItems,
  availablePage,
  availableTotalPages,
  soldPage,
  soldTotalPages,
  onAvailablePageChange,
  onSoldPageChange,
}: {
  items: Item[];
  bundles: Bundle[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onUpdateItem: (item: Item) => void;
  showAvailable?: boolean;
  showSold?: boolean;
  availableItems?: Item[];
  soldItems?: Item[];
  availablePage?: number;
  availableTotalPages?: number;
  soldPage?: number;
  soldTotalPages?: number;
  onAvailablePageChange?: (page: number) => void;
  onSoldPageChange?: (page: number) => void;
}) => {
  const getBundleName = (bundleId: string) => {
    const bundle = bundles.find((b) => b.id === bundleId);
    return bundle?.name || "Unknown Bundle";
  };

  const handleMarkAsSold = (item: Item) => {
    const soldPrice = prompt(
      `Enter sold price for "${item.name}":`,
      item.sellingPrice.toString()
    );
    if (soldPrice !== null) {
      const price = parseFloat(soldPrice);
      if (!isNaN(price) && price >= 0) {
        onUpdateItem({
          ...item,
          status: "Sold",
          soldPrice: price,
          soldDate: new Date().toISOString().split("T")[0],
        });
      } else {
        alert("Please enter a valid price");
      }
    }
  };

  const handleMarkAsAvailable = (item: Item) => {
    if (confirm("Mark this item as available again?")) {
      onUpdateItem({
        ...item,
        status: "Available",
        soldPrice: undefined,
        soldDate: undefined,
      });
    }
  };

  const displayAvailableItems = availableItems ?? (showAvailable ? items.filter((item) => item.status === "Available") : []);
  const displaySoldItems = soldItems ?? (showSold ? items.filter((item) => item.status === "Sold").sort((a, b) =>
    (b.soldDate || "").localeCompare(a.soldDate || "")
  ) : []);

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Available Items */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl sm:rounded-3xl blur-2xl" />
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/50">
          <h2 className="text-lg sm:text-2xl font-black mb-3 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <span className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Available Items ({displayAvailableItems.length})
            </span>
          </h2>

          {displayAvailableItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-2">
              {displayAvailableItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl sm:rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative bg-gradient-to-br from-white to-green-50/30 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-green-200 hover:border-green-400 transition-all duration-300">
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm sm:text-lg text-gray-800 truncate">
                          {item.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                          {getBundleName(item.bundleId)}
                        </p>
                      </div>
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={() => handleMarkAsSold(item)}
                          className="relative group/btn overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg" />
                          <div className="relative px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-white">
                            💰 Sell
                          </div>
                        </button>
                        <button
                          onClick={() => onEdit(item)}
                          className="text-blue-600 hover:text-blue-800 text-[10px] sm:text-xs font-bold"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this item?")) {
                              onDelete(item.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 text-[10px] sm:text-xs font-bold"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                      <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-800 px-2 py-0.5 sm:px-2 sm:py-1 rounded-lg font-bold">
                        📏 {item.size}
                      </span>
                      <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-800 px-2 py-0.5 sm:px-2 sm:py-1 rounded-lg font-bold">
                        {item.condition === "As New" && "✨"}
                        {item.condition === "Excellent" && "⭐"}
                        {item.condition === "Good" && "👍"}
                        {item.condition === "With Issue" && "⚠️"}
                        {item.condition === "Reject" && "❌"} {item.condition}
                      </span>
                      <span className="text-[10px] sm:text-xs bg-purple-100 text-purple-800 px-2 py-0.5 sm:px-2 sm:py-1 rounded-lg font-bold hidden sm:inline-block">
                        {item.source === "Mine" && "💼"}
                        {item.source === "Gift" && "🎁"}
                        {item.source === "Partial payment" && "💳"}
                        {item.source === "Credit" && "🏦"} {item.source}
                      </span>
                    </div>
                    <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {formatCurrency(item.sellingPrice)}
                    </p>
                    {item.issueNotes && (
                      <p className="text-[10px] sm:text-xs text-orange-600 mt-1 sm:mt-2 italic font-medium bg-orange-50 px-2 py-1 rounded">
                        ⚠️ {item.issueNotes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">📭</div>
              <p className="text-sm sm:text-base text-gray-500 font-medium">No available items</p>
            </div>
          )}
          {showAvailable && availableTotalPages && availableTotalPages > 1 && onAvailablePageChange && (
            <div className="mt-4">
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <button
                  onClick={() => onAvailablePageChange(Math.max(1, (availablePage || 1) - 1))}
                  disabled={(availablePage || 1) === 1}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-200 transition-colors text-sm sm:text-base"
                >
                  ←
                </button>
                <span className="text-sm sm:text-base font-bold text-gray-700">
                  Page {availablePage || 1} of {availableTotalPages}
                </span>
                <button
                  onClick={() => onAvailablePageChange(Math.min(availableTotalPages, (availablePage || 1) + 1))}
                  disabled={(availablePage || 1) === availableTotalPages}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-200 transition-colors text-sm sm:text-base"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sold Items */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl sm:rounded-3xl blur-2xl" />
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/50">
          <h2 className="text-lg sm:text-2xl font-black mb-3 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <span className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full" />
            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Sold Items ({displaySoldItems.length})
            </span>
          </h2>

          {displaySoldItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-2">
              {displaySoldItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-xl sm:rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-200 hover:border-gray-400 transition-all duration-300">
                      <div className="flex justify-between items-start mb-2 sm:mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm sm:text-lg text-gray-800 truncate">
                            {item.name}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                            {getBundleName(item.bundleId)}
                          </p>
                        </div>
                        <div className="flex gap-1 sm:gap-2">
                          <button
                            onClick={() => handleMarkAsAvailable(item)}
                            className="relative group/btn overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg" />
                            <div className="relative px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-white">
                              ↩️ Undo
                            </div>
                          </button>
                          <button
                            onClick={() => onEdit(item)}
                            className="text-blue-600 hover:text-blue-800 text-[10px] sm:text-xs font-bold"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this item?")) {
                                onDelete(item.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 text-[10px] sm:text-xs font-bold"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                        <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-800 px-2 py-0.5 sm:px-2 sm:py-1 rounded-lg font-bold">
                          📏 {item.size}
                        </span>
                        <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-800 px-2 py-0.5 sm:px-2 sm:py-1 rounded-lg font-bold">
                          {item.condition}
                        </span>
                        <span className="text-[10px] sm:text-xs bg-red-100 text-red-800 px-2 py-0.5 sm:px-2 sm:py-1 rounded-lg font-bold hidden sm:inline-block">
                          📅 {item.soldDate}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-gray-500 line-through font-medium">
                          List: {formatCurrency(item.sellingPrice)}
                        </p>
                        <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          Sold: {formatCurrency(item.soldPrice || 0)}
                        </p>
                      </div>
                      {item.issueNotes && (
                        <p className="text-[10px] sm:text-xs text-orange-600 mt-1 sm:mt-2 italic font-medium bg-orange-50 px-2 py-1 rounded">
                          ⚠️ {item.issueNotes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">💤</div>
              <p className="text-sm sm:text-base text-gray-500 font-medium">No sold items yet</p>
            </div>
          )}
          {showSold && soldTotalPages && soldTotalPages > 1 && onSoldPageChange && (
            <div className="mt-4">
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <button
                  onClick={() => onSoldPageChange(Math.max(1, (soldPage || 1) - 1))}
                  disabled={(soldPage || 1) === 1}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-200 transition-colors text-sm sm:text-base"
                >
                  ←
                </button>
                <span className="text-sm sm:text-base font-bold text-gray-700">
                  Page {soldPage || 1} of {soldTotalPages}
                </span>
                <button
                  onClick={() => onSoldPageChange(Math.min(soldTotalPages, (soldPage || 1) + 1))}
                  disabled={(soldPage || 1) === soldTotalPages}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-200 transition-colors text-sm sm:text-base"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {items.length === 0 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl sm:rounded-3xl blur-2xl" />
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-16 text-center border border-white/50">
            <div className="text-5xl sm:text-8xl mb-4 sm:mb-6 animate-bounce-slow">👕</div>
            <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              No items yet
            </p>
            <p className="text-sm sm:text-base text-gray-500 font-medium">
              Add items to bundles to start tracking inventory
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
