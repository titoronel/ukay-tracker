"use client";

import { Item, Bundle } from "@/types";
import { formatCurrency } from "@/lib/utils";

export const ItemList = ({
  items,
  bundles,
  onEdit,
  onDelete,
  onUpdateItem,
}: {
  items: Item[];
  bundles: Bundle[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onUpdateItem: (item: Item) => void;
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

  const availableItems = items.filter((item) => item.status === "Available");
  const soldItems = items.filter((item) => item.status === "Sold");

  return (
    <div className="space-y-8">
      {/* Available Items */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl" />
        <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
            <span className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Available Items ({availableItems.length})
            </span>
          </h2>

          {availableItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="group relative animate-fadeIn"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative bg-gradient-to-br from-white to-green-50/30 rounded-2xl p-5 border-2 border-green-200 hover:border-green-400 transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                          {getBundleName(item.bundleId)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMarkAsSold(item)}
                          className="relative group/btn overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg" />
                          <div className="relative px-3 py-1 text-xs font-bold text-white">
                            💰 Sell
                          </div>
                        </button>
                        <button
                          onClick={() => onEdit(item)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-bold"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this item?")) {
                              onDelete(item.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 text-xs font-bold"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-lg font-bold">
                        📏 {item.size}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-lg font-bold">
                        {item.condition === "As New" && "✨"}
                        {item.condition === "Excellent" && "⭐"}
                        {item.condition === "Good" && "👍"}
                        {item.condition === "With Issue" && "⚠️"}
                        {item.condition === "Reject" && "❌"} {item.condition}
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-lg font-bold">
                        {item.source === "Mine" && "💼"}
                        {item.source === "Gift" && "🎁"}
                        {item.source === "Partial payment" && "💳"}
                        {item.source === "Credit" && "🏦"} {item.source}
                      </span>
                    </div>
                    <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {formatCurrency(item.sellingPrice)}
                    </p>
                    {item.issueNotes && (
                      <p className="text-xs text-orange-600 mt-2 italic font-medium bg-orange-50 px-2 py-1 rounded">
                        ⚠️ {item.issueNotes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-500 font-medium">No available items</p>
            </div>
          )}
        </div>
      </div>

      {/* Sold Items */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
        <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
            <span className="w-4 h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full" />
            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Sold Items ({soldItems.length})
            </span>
          </h2>

          {soldItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {soldItems
                .sort((a, b) =>
                  (b.soldDate || "").localeCompare(a.soldDate || "")
                )
                .map((item, idx) => (
                  <div
                    key={item.id}
                    className="group relative animate-fadeIn"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border-2 border-gray-200 hover:border-gray-400 transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">
                            {getBundleName(item.bundleId)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMarkAsAvailable(item)}
                            className="relative group/btn overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg" />
                            <div className="relative px-3 py-1 text-xs font-bold text-white">
                              ↩️ Undo
                            </div>
                          </button>
                          <button
                            onClick={() => onEdit(item)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-bold"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this item?")) {
                                onDelete(item.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 text-xs font-bold"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-lg font-bold">
                          📏 {item.size}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-lg font-bold">
                          {item.condition}
                        </span>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-lg font-bold">
                          📅 {item.soldDate}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 line-through font-medium">
                          List: {formatCurrency(item.sellingPrice)}
                        </p>
                        <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          Sold: {formatCurrency(item.soldPrice || 0)}
                        </p>
                      </div>
                      {item.issueNotes && (
                        <p className="text-xs text-orange-600 mt-2 italic font-medium bg-orange-50 px-2 py-1 rounded">
                          ⚠️ {item.issueNotes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">💤</div>
              <p className="text-gray-500 font-medium">No sold items yet</p>
            </div>
          )}
        </div>
      </div>

      {items.length === 0 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
          <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-16 text-center border border-white/50">
            <div className="text-8xl mb-6 animate-bounce-slow">👕</div>
            <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              No items yet
            </p>
            <p className="text-gray-500 font-medium">
              Add items to bundles to start tracking inventory
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
