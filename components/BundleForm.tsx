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

  const inputClass = "w-full px-3 py-2.5 bg-card border border-border rounded-lg text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-150";

  return (
    <div className="bg-card border border-border rounded-xl p-5 sm:p-6 animate-fadeIn">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        {bundle ? "Edit Bundle" : "New Bundle"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
            placeholder="e.g., Verde V4"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Bundle["category"] })}
            className={inputClass}
            required
          >
            <option value="Jackets">Jackets</option>
            <option value="Hoodies">Hoodies</option>
            <option value="T-Shirts">T-Shirts</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Total Cost (₱)</label>
            <input
              type="number"
              value={formData.totalCost || ""}
              onChange={(e) => setFormData({ ...formData, totalCost: parseFloat(e.target.value) || 0 })}
              className={inputClass}
              placeholder="0"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Total Pieces</label>
            <input
              type="number"
              value={formData.totalPieces || ""}
              onChange={(e) => setFormData({ ...formData, totalPieces: parseInt(e.target.value) || 0 })}
              className={inputClass}
              placeholder="0"
              min="1"
              required
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-150"
          >
            {bundle ? "Save Changes" : "Create Bundle"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-muted text-muted-foreground text-sm font-medium rounded-lg hover:bg-muted/80 transition-colors duration-150"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};