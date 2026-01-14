"use client";

import { useState } from "react";
import { Bundle, Item } from "@/types";

export const ItemForm = ({
  bundles,
  item,
  onSubmit,
  onCancel,
}: {
  bundles: Bundle[];
  item?: Item | null;
  onSubmit: (
    item: Omit<Item, "id" | "createdAt"> & { soldDate?: string }
  ) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    bundleId: item?.bundleId || "",
    name: item?.name || "",
    sellingPrice: item?.sellingPrice || 0,
    estimatedCost: item?.estimatedCost || undefined,
    size: item?.size || "",
    condition: item?.condition || ("Good" as Item["condition"]),
    issueNotes: item?.issueNotes || "",
    source: item?.source || ("Mine" as Item["source"]),
    status: item?.status || ("Available" as Item["status"]),
    soldPrice: item?.soldPrice || 0,
    soldDate: item?.soldDate || new Date().toISOString().split("T")[0],
  });

  const selectedBundle = bundles.find((b) => b.id === formData.bundleId);
  const estimatedCost =
    formData.estimatedCost !== undefined
      ? formData.estimatedCost
      : selectedBundle
      ? selectedBundle.totalCost / selectedBundle.totalPieces
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      soldDate: formData.status === "Sold" ? formData.soldDate : undefined,
      soldPrice: formData.status === "Sold" ? formData.soldPrice : undefined,
    });
  };

  return (
    <div className="relative animate-fadeIn">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl sm:rounded-3xl blur-2xl" />
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/50">
        <h2 className="text-xl sm:text-3xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          {item ? "✏️ Edit Item" : "✨ Add New Item"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
              Bundle *
            </label>
            <select
              value={formData.bundleId}
              onChange={(e) =>
                setFormData({ ...formData, bundleId: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 text-sm sm:text-base"
              required
            >
              <option value="">Select a bundle</option>
              {bundles.map((bundle) => (
                <option key={bundle.id} value={bundle.id}>
                  {bundle.name} ({bundle.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 text-sm sm:text-base"
              placeholder="e.g., Denim Jacket, Black Hoodie"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                Selling Price (₱) *
              </label>
              <input
                type="number"
                value={formData.sellingPrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sellingPrice: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 text-sm sm:text-base"
                placeholder="e.g., 500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                Size *
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 text-sm sm:text-base"
                placeholder="e.g., L, XL, 36"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                Condition *
              </label>
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    condition: e.target.value as Item["condition"],
                  })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 text-sm sm:text-base"
                required
              >
                <option value="As New">✨ As New</option>
                <option value="Excellent">⭐ Excellent</option>
                <option value="Good">👍 Good</option>
                <option value="With Issue">⚠️ With Issue</option>
                <option value="Reject">❌ Reject</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                Source *
              </label>
              <select
                value={formData.source}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    source: e.target.value as Item["source"],
                  })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 text-sm sm:text-base"
                required
              >
                <option value="Mine">💼 Mine</option>
                <option value="Gift">🎁 Gift (₱0 cost)</option>
                <option value="Partial payment">💳 Partial payment</option>
                <option value="Credit">🏦 Credit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
              Estimated Cost (₱)
            </label>
            <input
              type="number"
              value={
                formData.estimatedCost !== undefined
                  ? formData.estimatedCost
                  : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estimatedCost: e.target.value
                    ? parseFloat(e.target.value)
                    : undefined,
                })
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 text-sm sm:text-base"
              placeholder={`Auto: ${estimatedCost.toFixed(2)}`}
              min="0"
              step="0.01"
            />
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2 font-medium">
              💡 Auto-calculated from bundle: ₱{estimatedCost.toFixed(2)} per
              piece
            </p>
          </div>

          {(formData.condition === "With Issue" ||
            formData.condition === "Reject") && (
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                Issue / Notes
              </label>
              <textarea
                value={formData.issueNotes}
                onChange={(e) =>
                  setFormData({ ...formData, issueNotes: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 text-sm sm:text-base"
                rows={3}
                placeholder="Describe any issues..."
              />
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as Item["status"],
                })
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 text-sm sm:text-base"
              required
            >
              <option value="Available">🟢 Available</option>
              <option value="Sold">💰 Sold</option>
            </select>
          </div>

          {formData.status === "Sold" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                  Sold Price (₱) *
                </label>
                <input
                  type="number"
                  value={formData.soldPrice || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      soldPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 text-sm sm:text-base"
                  placeholder="e.g., 450"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                  Sold Date *
                </label>
                <input
                  type="date"
                  value={formData.soldDate}
                  onChange={(e) =>
                    setFormData({ ...formData, soldDate: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 text-sm sm:text-base"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 sm:gap-4 pt-2 sm:pt-4">
            <button type="submit" className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg sm:rounded-xl transition-transform group-hover:scale-105" />
              <div className="relative px-4 sm:px-6 py-2 sm:py-3 font-bold text-white text-sm sm:text-base">
                {item ? "💾 Update Item" : "🚀 Add Item"}
              </div>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold hover:bg-gray-300 transition-all duration-300 text-sm sm:text-base"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
