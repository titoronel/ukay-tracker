"use client";

import { useState } from "react";
import { Item, Bundle } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Pencil, Trash2, RotateCcw, Shirt, Search } from "lucide-react";
import { toast } from "sonner";
import { SellModal } from "./SellModal";

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
  availableCount,
  soldCount,
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
  availableCount?: number;
  soldCount?: number;
  availablePage?: number;
  availableTotalPages?: number;
  soldPage?: number;
  soldTotalPages?: number;
  onAvailablePageChange?: (page: number) => void;
  onSoldPageChange?: (page: number) => void;
}) => {
  const [sellingItem, setSellingItem] = useState<Item | null>(null);

  const getBundleName = (bundleId: string) => bundles.find((b) => b.id === bundleId)?.name || "Unknown";

  const handleConfirmSale = (sold: { soldPrice: number; soldDate: string; soldNotes?: string }) => {
    if (!sellingItem) return;
    onUpdateItem({
      ...sellingItem,
      status: "Sold",
      soldPrice: sold.soldPrice,
      soldDate: sold.soldDate,
      soldNotes: sold.soldNotes,
    });
    toast.success(`${sellingItem.name} sold for ${formatCurrency(sold.soldPrice)}`);
    setSellingItem(null);
  };

  const handleMarkAsAvailable = (item: Item) => {
    onUpdateItem({
      ...item,
      status: "Available",
      soldPrice: undefined,
      soldDate: undefined,
      soldNotes: undefined,
    });
    toast.success(`${item.name} marked as available`);
  };

  const displayAvailableItems = showAvailable ? (availableItems ?? items.filter((i) => i.status === "Available")) : [];
  const displaySoldItems = showSold ? (soldItems ?? items.filter((i) => i.status === "Sold").sort((a, b) => (b.soldDate || "").localeCompare(a.soldDate || ""))) : [];
  const availableHeadingCount = availableCount ?? displayAvailableItems.length;
  const soldHeadingCount = soldCount ?? displaySoldItems.length;

  const conditionColor = (c: string) => {
    const map: Record<string, string> = {
      "As New": "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      "Excellent": "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      "Good": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      "With Issue": "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      "Reject": "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return map[c] || map["Good"];
  };

  const ItemCard = ({ item }: { item: Item }) => (
    <div className="bg-card border border-border rounded-xl p-4 transition-colors duration-150 hover:border-border/80">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{getBundleName(item.bundleId)}</p>
        </div>
        <div className="flex items-center gap-0.5 ml-2">
          {item.status === "Available" && (
            <button onClick={() => setSellingItem(item)} className="px-2 py-1 text-xs font-medium text-white bg-accent rounded-md hover:bg-accent/90 transition-colors duration-150">
              Sell
            </button>
          )}
          {item.status === "Sold" && (
            <button onClick={() => handleMarkAsAvailable(item)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150" title="Mark as available">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={() => onEdit(item)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-md text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors duration-150">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-2.5">
        <span className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-md">{item.size}</span>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${conditionColor(item.condition)}`}>{item.condition}</span>
        {item.status === "Sold" && item.soldDate && (
          <span className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-md">{item.soldDate}</span>
        )}
      </div>

      {item.status === "Available" ? (
        <p className="text-lg font-semibold text-foreground">{formatCurrency(item.sellingPrice)}</p>
      ) : (
        <div className="flex items-baseline gap-2">
          <p className="text-lg font-semibold text-success">{formatCurrency(item.soldPrice || 0)}</p>
          {item.sellingPrice !== item.soldPrice && (
            <p className="text-xs text-muted-foreground line-through">{formatCurrency(item.sellingPrice)}</p>
          )}
        </div>
      )}

      {item.soldNotes && (
        <p className="text-xs text-muted-foreground mt-1.5">{item.soldNotes}</p>
      )}
      {item.issueNotes && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5">{item.issueNotes}</p>
      )}
    </div>
  );

  const Pagination = ({ page, totalPages, onChange }: { page?: number; totalPages?: number; onChange?: (p: number) => void }) => {
    if (!totalPages || totalPages <= 1 || !onChange) return null;
    return (
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
        <div className="flex gap-1">
          <button onClick={() => onChange(Math.max(1, (page || 1) - 1))} disabled={(page || 1) === 1} className="px-2.5 py-1 text-xs font-medium text-muted-foreground bg-muted rounded-md hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150">
            Prev
          </button>
          <button onClick={() => onChange(Math.min(totalPages, (page || 1) + 1))} disabled={(page || 1) === totalPages} className="px-2.5 py-1 text-xs font-medium text-muted-foreground bg-muted rounded-md hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150">
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {showAvailable && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            Available ({availableHeadingCount})
          </h2>
          {displayAvailableItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displayAvailableItems.map((item) => <ItemCard key={item.id} item={item} />)}
              </div>
              <Pagination page={availablePage} totalPages={availableTotalPages} onChange={onAvailablePageChange} />
            </>
          ) : (
            <div className="bg-card border border-border border-dashed rounded-xl p-8 text-center">
              <Shirt className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No available items</p>
            </div>
          )}
        </div>
      )}

      {showSold && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
            Sold ({soldHeadingCount})
          </h2>
          {displaySoldItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displaySoldItems.map((item) => <ItemCard key={item.id} item={item} />)}
              </div>
              <Pagination page={soldPage} totalPages={soldTotalPages} onChange={onSoldPageChange} />
            </>
          ) : (
            <div className="bg-card border border-border border-dashed rounded-xl p-8 text-center">
              <Search className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No sold items yet</p>
            </div>
          )}
        </div>
      )}

      {sellingItem && (
        <SellModal
          item={sellingItem}
          onConfirm={handleConfirmSale}
          onCancel={() => setSellingItem(null)}
        />
      )}
    </div>
  );
};