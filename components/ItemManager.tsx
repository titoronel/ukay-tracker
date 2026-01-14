"use client";

import { useState } from "react";
import { Bundle, Item } from "@/types";
import { generateId } from "@/lib/utils";
import { ItemForm } from "./ItemForm";
import { ItemList } from "./ItemList";

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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAvailable, setShowAvailable] = useState(true);
  const [showSold, setShowSold] = useState(true);

  const handleSubmit = async (
    itemData: Omit<Item, "id" | "createdAt" | "soldDate"> & {
      soldDate?: string;
    }
  ) => {
    try {
      const newItem = {
        ...itemData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        soldDate:
          itemData.status === "Sold"
            ? itemData.soldDate || new Date().toISOString().split("T")[0]
            : undefined,
      };

      if (editingItem) {
        const updatedItem = {
          ...newItem,
          id: editingItem.id,
          createdAt: editingItem.createdAt,
        };
        await onUpdateItem(updatedItem);
        setEditingItem(null);
      } else {
        await onAddItem(newItem);
      }
      setShowForm(false);
      setSelectedBundle("");
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item");
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setSelectedBundle(item.bundleId);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await onDeleteItem(id);
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item");
      }
    }
  };

  const handleUpdateItem = async (updatedItem: Item) => {
    try {
      await onUpdateItem(updatedItem);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setSelectedBundle("");
  };

  const filteredItems = selectedBundle
    ? items.filter((item) => item.bundleId === selectedBundle)
    : items;

  const availableItems = filteredItems.filter((item) => item.status === "Available");
  const soldItems = filteredItems.filter((item) => item.status === "Sold");

  const canLoadMoreAvailable = showAvailable && availableItems.length > itemsPerPage;
  const canLoadMoreSold = showSold && soldItems.length > itemsPerPage;

  return (
    <div className="space-y-4 sm:space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Item Management
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 font-medium">
            Track individual items in your inventory
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="relative group flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl transition-transform group-hover:scale-105 group-hover:rotate-1" />
            <div className="relative px-4 sm:px-6 py-2 sm:py-3 font-bold text-white flex items-center gap-2 text-sm sm:text-base">
              <span className="text-lg sm:text-xl">➕</span>
              <span className="hidden sm:inline">Add Item</span>
              <span className="sm:hidden">Add</span>
            </div>
          </button>
        )}
      </div>

      {!showForm && bundles.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl sm:rounded-2xl blur-xl" />
          <div className="relative bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6 border border-white/50">
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">
              🔍 Filter by Bundle
            </label>
            <select
              value={selectedBundle}
              onChange={(e) => setSelectedBundle(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium text-sm sm:text-base"
            >
              <option value="">All Bundles</option>
              {bundles.map((bundle) => (
                <option key={bundle.id} value={bundle.id}>
                  {bundle.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {!showForm && !selectedBundle && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl sm:rounded-2xl blur-xl" />
          <div className="relative bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6 border border-white/50">
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">
              🎛️ Show Sections
            </label>
            <div className="flex gap-3 sm:gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAvailable}
                  onChange={(e) => setShowAvailable(e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm sm:text-base font-medium text-gray-700">
                  Available ({availableItems.length})
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSold}
                  onChange={(e) => setShowSold(e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm sm:text-base font-medium text-gray-700">
                  Sold ({soldItems.length})
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {showForm ? (
        <ItemForm
          bundles={bundles}
          item={editingItem}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <ItemList
            items={filteredItems}
            bundles={bundles}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUpdateItem={handleUpdateItem}
            limitItems={itemsPerPage}
            showAvailable={showAvailable}
            showSold={showSold}
          />
          {(canLoadMoreAvailable || canLoadMoreSold) && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl sm:rounded-2xl blur-xl" />
              <div className="relative bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-white/50 text-center">
                <button
                  onClick={() => setItemsPerPage((prev) => prev + 10)}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Load More Items
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
