"use client";

import { useState } from "react";
import { Bundle, Item } from "@/types";
import { generateId } from "@/lib/utils";
import { BundleList } from "./BundleList";
import { BundleForm } from "./BundleForm";

export const BundleManager = ({
  bundles,
  items,
  onAddBundle,
  onUpdateBundle,
  onDeleteBundle,
  onAddItem, // eslint-disable-line @typescript-eslint/no-unused-vars
  onUpdateItem, // eslint-disable-line @typescript-eslint/no-unused-vars
  onDeleteItem, // eslint-disable-line @typescript-eslint/no-unused-vars
  refresh, // eslint-disable-line @typescript-eslint/no-unused-vars
}: {
  bundles: Bundle[];
  items: Item[];
  onAddBundle: (bundle: Bundle) => Promise<void>;
  onUpdateBundle: (bundle: Bundle) => Promise<void>;
  onDeleteBundle: (id: string) => Promise<void>;
  onAddItem: (item: Item) => Promise<void>;
  onUpdateItem: (item: Item) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);

  const handleSubmit = async (bundleData: Omit<Bundle, "id" | "createdAt">) => {
    try {
      if (editingBundle) {
        const updatedBundle = { ...editingBundle, ...bundleData };
        await onUpdateBundle(updatedBundle);
        setEditingBundle(null);
      } else {
        const newBundle = {
          ...bundleData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        await onAddBundle(newBundle);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving bundle:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save bundle';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleEdit = (bundle: Bundle) => {
    setEditingBundle(bundle);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('This will also delete all items in this bundle. Continue?')) {
      try {
        await onDeleteBundle(id);
      } catch (error) {
        console.error('Error deleting bundle:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete bundle';
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBundle(null);
  };

  return (
    <div className="space-y-4 sm:space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bundle Management
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 font-medium">
            Organize your inventory into bundles
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="relative group flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl transition-transform group-hover:scale-105 group-hover:rotate-1" />
            <div className="relative px-4 sm:px-6 py-2 sm:py-3 font-bold text-white flex items-center gap-2 text-sm sm:text-base">
              <span className="text-lg sm:text-xl">➕</span>
              <span className="hidden sm:inline">New Bundle</span>
              <span className="sm:hidden">New</span>
            </div>
          </button>
        )}
      </div>

      {showForm ? (
        <BundleForm
          bundle={editingBundle}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <BundleList
          bundles={bundles}
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
