"use client";

import { useState } from "react";
import { Bundle, Item } from "@/types";
import { generateId, getLocalDateString } from "@/lib/utils";
import { ItemForm } from "./ItemForm";
import { ItemList } from "./ItemList";
import { Plus, Search, X } from "lucide-react";
import { toast } from "sonner";

export const ItemManager = ({
  bundles,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  refresh, // eslint-disable-line @typescript-eslint/no-unused-vars
}: {
  bundles: Bundle[];
  items: Item[];
  onAddItem: (item: Item) => Promise<void>;
  onUpdateItem: (item: Item) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<string>("");
  const [showAvailable, setShowAvailable] = useState(true);
  const [showSold, setShowSold] = useState(true);
  const [availablePage, setAvailablePage] = useState(1);
  const [soldPage, setSoldPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState<string[]>([]);
  const [sourceFilter, setSourceFilter] = useState<string[]>([]);
  const ITEMS_PER_PAGE = 10;

  const handleSubmit = async (itemData: Omit<Item, "id" | "createdAt" | "soldDate"> & { soldDate?: string }) => {
    try {
      const newItem = {
        ...itemData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        soldDate: itemData.status === "Sold" ? itemData.soldDate || getLocalDateString() : undefined,
      };

      if (editingItem) {
        await onUpdateItem({ ...newItem, id: editingItem.id, createdAt: editingItem.createdAt });
        setEditingItem(null);
        toast.success("Item updated");
      } else {
        await onAddItem(newItem);
        toast.success("Item added");
      }
      setShowForm(false);
      setSelectedBundle("");
    } catch {
      toast.error("Failed to save item");
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setSelectedBundle(item.bundleId);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    toast.warning("Delete this item?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await onDeleteItem(id);
            toast.success("Item deleted");
          } catch {
            toast.error("Failed to delete item");
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const handleUpdateItem = async (updatedItem: Item) => {
    try {
      await onUpdateItem(updatedItem);
    } catch {
      toast.error("Failed to update item");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setSelectedBundle("");
  };

  const toggleCondition = (condition: string) => {
    setConditionFilter((prev) => prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]);
  };

  const toggleSource = (source: string) => {
    setSourceFilter((prev) => prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBundle("");
    setConditionFilter([]);
    setSourceFilter([]);
  };

  const filteredItems = items.filter((item) => {
    if (selectedBundle && item.bundleId !== selectedBundle) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const bundle = bundles.find((b) => b.id === item.bundleId);
      if (!item.name.toLowerCase().includes(query) && !bundle?.name.toLowerCase().includes(query)) return false;
    }
    if (conditionFilter.length > 0 && !conditionFilter.includes(item.condition)) return false;
    if (sourceFilter.length > 0 && !sourceFilter.includes(item.source)) return false;
    return true;
  });

  const allAvailableItems = filteredItems.filter((item) => item.status === "Available");
  const allSoldItems = filteredItems.filter((item) => item.status === "Sold");

  const availableTotalPages = Math.ceil(allAvailableItems.length / ITEMS_PER_PAGE);
  const soldTotalPages = Math.ceil(allSoldItems.length / ITEMS_PER_PAGE);

  const paginatedAvailableItems = allAvailableItems.slice((availablePage - 1) * ITEMS_PER_PAGE, availablePage * ITEMS_PER_PAGE);
  const paginatedSoldItems = allSoldItems.slice((soldPage - 1) * ITEMS_PER_PAGE, soldPage * ITEMS_PER_PAGE);

  const hasActiveFilters = searchQuery || selectedBundle || conditionFilter.length > 0 || sourceFilter.length > 0;

  const chipClass = "px-2.5 py-1 text-xs font-medium rounded-full border transition-colors duration-150";

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Items</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track individual items in your inventory</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-150"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Item</span>
          </button>
        )}
      </div>

      {!showForm && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items or bundles..."
                className="w-full pl-9 pr-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-150"
              />
            </div>
            {bundles.length > 0 && (
              <select
                value={selectedBundle}
                onChange={(e) => { setSelectedBundle(e.target.value); setAvailablePage(1); setSoldPage(1); }}
                className="sm:w-48 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-150"
              >
                <option value="">All Bundles</option>
                {bundles.map((bundle) => (
                  <option key={bundle.id} value={bundle.id}>{bundle.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {["As New", "Excellent", "Good", "With Issue", "Reject"].map((c) => (
              <button
                key={c}
                onClick={() => toggleCondition(c)}
                className={`${chipClass} ${conditionFilter.includes(c) ? "bg-accent text-white border-accent" : "bg-muted text-muted-foreground border-border hover:border-accent/50"}`}
              >
                {c}
              </button>
            ))}
            <span className="w-px h-6 bg-border self-center mx-1" />
            {["Mine", "Gift", "Partial payment", "Credit"].map((s) => (
              <button
                key={s}
                onClick={() => toggleSource(s)}
                className={`${chipClass} ${sourceFilter.includes(s) ? "bg-accent text-white border-accent" : "bg-muted text-muted-foreground border-border hover:border-accent/50"}`}
              >
                {s}
              </button>
            ))}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-danger hover:bg-danger/10 rounded-full transition-colors duration-150"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          <div className="flex gap-4 mt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showAvailable} onChange={(e) => { setShowAvailable(e.target.checked); setAvailablePage(1); }} className="w-4 h-4 rounded border-border text-accent focus:ring-accent/20" />
              <span className="text-sm text-muted-foreground">Available ({allAvailableItems.length})</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showSold} onChange={(e) => { setShowSold(e.target.checked); setSoldPage(1); }} className="w-4 h-4 rounded border-border text-accent focus:ring-accent/20" />
              <span className="text-sm text-muted-foreground">Sold ({allSoldItems.length})</span>
            </label>
          </div>
        </div>
      )}

      {showForm ? (
        <ItemForm bundles={bundles} item={editingItem} onSubmit={handleSubmit} onCancel={handleCancel} />
      ) : (
        <ItemList
          items={filteredItems}
          bundles={bundles}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdateItem={handleUpdateItem}
          showAvailable={showAvailable}
          showSold={showSold}
          availableItems={paginatedAvailableItems}
          soldItems={paginatedSoldItems}
          availableCount={allAvailableItems.length}
          soldCount={allSoldItems.length}
          availablePage={availablePage}
          availableTotalPages={availableTotalPages}
          soldPage={soldPage}
          soldTotalPages={soldTotalPages}
          onAvailablePageChange={(page) => setAvailablePage(Math.max(1, Math.min(availableTotalPages, page)))}
          onSoldPageChange={(page) => setSoldPage(Math.max(1, Math.min(soldTotalPages, page)))}
        />
      )}
    </div>
  );
};
