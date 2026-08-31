"use client";

import { useEffect, useRef, useState } from "react";
import { Item } from "@/types";
import { formatCurrency, getLocalDateString } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

export function SellModal({
  item,
  onConfirm,
  onCancel,
}: {
  item: Item;
  onConfirm: (sold: { soldPrice: number; soldDate: string; soldNotes?: string }) => void;
  onCancel: () => void;
}) {
  const [soldPrice, setSoldPrice] = useState(
    item.sellingPrice ? String(item.sellingPrice) : ""
  );
  const [soldDate, setSoldDate] = useState(getLocalDateString());
  const [soldNotes, setSoldNotes] = useState("");
  const [error, setError] = useState("");
  const priceRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    priceRef.current?.focus();
    priceRef.current?.select();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(soldPrice);
    if (isNaN(price) || price < 0) {
      setError("Enter a valid price");
      return;
    }
    if (!soldDate) {
      setError("Pick a sold date");
      return;
    }
    onConfirm({
      soldPrice: price,
      soldDate,
      soldNotes: soldNotes.trim() || undefined,
    });
  };

  const inputClass =
    "w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-150";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sell-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
        onClick={onCancel}
      />
      <div className="relative w-full sm:max-w-md bg-card border border-border rounded-t-2xl sm:rounded-xl p-5 sm:p-6 animate-fadeIn">
        <div className="flex items-start justify-between mb-1">
          <div className="min-w-0 pr-3">
            <h2 id="sell-modal-title" className="text-lg font-semibold text-foreground">
              Mark as sold
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5 truncate">{item.name}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          List price {formatCurrency(item.sellingPrice)}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sold-price" className="block text-xs font-medium text-muted-foreground mb-1.5">
                Sold price (₱)
              </label>
              <input
                id="sold-price"
                ref={priceRef}
                type="number"
                min="0"
                step="0.01"
                value={soldPrice}
                onChange={(e) => {
                  setSoldPrice(e.target.value);
                  setError("");
                }}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="sold-date" className="block text-xs font-medium text-muted-foreground mb-1.5">
                Sold date
              </label>
              <input
                id="sold-date"
                type="date"
                value={soldDate}
                onChange={(e) => {
                  setSoldDate(e.target.value);
                  setError("");
                }}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="sold-notes" className="block text-xs font-medium text-muted-foreground mb-1.5">
              Note <span className="font-normal">(optional)</span>
            </label>
            <textarea
              id="sold-notes"
              value={soldNotes}
              onChange={(e) => setSoldNotes(e.target.value)}
              className={inputClass}
              rows={2}
              placeholder="Discount, buyer, stall..."
            />
          </div>

          {error && <p className="text-xs text-danger">{error}</p>}

          <div className="flex gap-3 pt-1">
            <Button type="submit" className="flex-1">
              Confirm sale
            </Button>
            <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
