"use client";

import { useState } from "react";
import { Bundle, Item } from "@/types";
import { getLocalDateString } from "@/lib/utils";

export const ItemForm = ({
  bundles,
  item,
  defaultBundleId,
  onSubmit,
  onCancel,
}: {
  bundles: Bundle[];
  item?: Item | null;
  defaultBundleId?: string;
  onSubmit: (item: Omit<Item, "id" | "createdAt"> & { soldDate?: string }) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    bundleId: item?.bundleId || defaultBundleId || "",
    name: item?.name || "",
    sellingPrice: item?.sellingPrice || 0,
    estimatedCost: item?.estimatedCost || undefined,
    size: item?.size || "",
    condition: item?.condition || ("Good" as Item["condition"]),
    issueNotes: item?.issueNotes || "",
    source: item?.source || ("Mine" as Item["source"]),
    status: item?.status || ("Available" as Item["status"]),
    soldPrice: item?.soldPrice || 0,
    soldDate: item?.soldDate || getLocalDateString(),
  });

  const selectedBundle = bundles.find((b) => b.id === formData.bundleId);
  const estimatedCost = formData.estimatedCost !== undefined ? formData.estimatedCost : selectedBundle ? selectedBundle.totalCost / selectedBundle.totalPieces : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      soldDate: formData.status === "Sold" ? formData.soldDate : undefined,
      soldPrice: formData.status === "Sold" ? formData.soldPrice : undefined,
    });
  };

  const inputClass = "w-full px-3 py-2.5 bg-card border border-border rounded-lg text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-150";

  return (
    <div className="bg-card border border-border rounded-xl p-5 sm:p-6 animate-fadeIn">
      <h2 className="text-lg font-semibold text-foreground mb-4">{item ? "Edit Item" : "New Item"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Bundle</label>
          <select value={formData.bundleId} onChange={(e) => setFormData({ ...formData, bundleId: e.target.value })} className={inputClass} required>
            <option value="">Select a bundle</option>
            {bundles.map((b) => (
              <option key={b.id} value={b.id}>{b.name} ({b.category})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Item Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="e.g., Denim Jacket" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Selling Price (₱)</label>
            <input type="number" value={formData.sellingPrice || ""} onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })} className={inputClass} placeholder="0" min="0" step="0.01" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Size</label>
            <input type="text" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} className={inputClass} placeholder="e.g., L, XL" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Condition</label>
            <select value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value as Item["condition"] })} className={inputClass} required>
              <option value="As New">As New</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="With Issue">With Issue</option>
              <option value="Reject">Reject</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Source</label>
            <select value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value as Item["source"] })} className={inputClass} required>
              <option value="Mine">Mine</option>
              <option value="Gift">Gift</option>
              <option value="Partial payment">Partial payment</option>
              <option value="Credit">Credit</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Estimated Cost (₱)</label>
          <input type="number" value={formData.estimatedCost !== undefined ? formData.estimatedCost : ""} onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value ? parseFloat(e.target.value) : undefined })} className={inputClass} placeholder={`Auto: ₱${estimatedCost.toFixed(2)}`} min="0" step="0.01" />
          <p className="text-xs text-muted-foreground mt-1">Auto-calculated from bundle: ₱{estimatedCost.toFixed(2)} per piece</p>
        </div>

        {(formData.condition === "With Issue" || formData.condition === "Reject") && (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Issue Notes</label>
            <textarea value={formData.issueNotes} onChange={(e) => setFormData({ ...formData, issueNotes: e.target.value })} className={inputClass} rows={3} placeholder="Describe any issues..." />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Status</label>
          <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as Item["status"] })} className={inputClass} required>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>
        </div>

        {formData.status === "Sold" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Sold Price (₱)</label>
              <input type="number" value={formData.soldPrice || ""} onChange={(e) => setFormData({ ...formData, soldPrice: parseFloat(e.target.value) || 0 })} className={inputClass} placeholder="0" min="0" step="0.01" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Sold Date</label>
              <input type="date" value={formData.soldDate} onChange={(e) => setFormData({ ...formData, soldDate: e.target.value })} className={inputClass} required />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-150">
            {item ? "Save Changes" : "Add Item"}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 bg-muted text-muted-foreground text-sm font-medium rounded-lg hover:bg-muted/80 transition-colors duration-150">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};