"use client";

import { useState } from "react";
import { Bundle } from "@/types";

export const BundleForm = ({
  bundle,
  onSubmit,
  onCancel,
}: {
  bundle?: Bundle | null;
  onSubmit: (bundle: Omit<Bundle, "id" | "createdAt">) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: bundle?.name || "",
    category: bundle?.category || ("Jackets" as Bundle["category"]),
    totalCost: bundle?.totalCost || 0,
    totalPieces: bundle?.totalPieces || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="relative animate-fadeIn">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl sm:rounded-3xl blur-2xl" />
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/50">
        <h2 className="text-xl sm:text-3xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {bundle ? "✏️ Edit Bundle" : "✨ Create New Bundle"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
              Bundle Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 text-sm sm:text-base"
              placeholder="e.g., Verde V4, Pb-05, Dimes"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as Bundle["category"],
                })
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 text-sm sm:text-base"
              required
            >
              <option value="Jackets">🧥 Jackets</option>
              <option value="Hoodies">👕 Hoodies</option>
              <option value="T-Shirts">👔 T-Shirts</option>
              <option value="Mixed">🎨 Mixed</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                Total Bundle Cost (₱)
              </label>
              <input
                type="number"
                value={formData.totalCost || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalCost: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 text-sm sm:text-base"
                placeholder="e.g., 6000"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                Total Pieces
              </label>
              <input
                type="number"
                value={formData.totalPieces || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalPieces: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 text-sm sm:text-base"
                placeholder="e.g., 20"
                min="1"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 sm:gap-4 pt-2 sm:pt-4">
            <button type="submit" className="flex-1 relative group ">
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl transition-transform group-hover:scale-105" />
              <div className="relative px-4 sm:px-6 py-2 sm:py-3 font-bold text-white text-sm sm:text-base">
                {bundle ? "💾 Update Bundle" : "🚀 Create Bundle"}
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
