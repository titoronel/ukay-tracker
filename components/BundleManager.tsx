"use client";

import { useState } from "react";
import { Bundle, Item } from "@/types";
import { generateId } from "@/lib/utils";
import { BundleList } from "./BundleList";
import { BundleForm } from "./BundleForm";
import { Plus } from "lucide-react";
import { toast } from "sonner";

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
        toast.success("Bundle updated");
      } else {
        const newBundle = {
          ...bundleData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        await onAddBundle(newBundle);
        toast.success("Bundle created");
      }
      setShowForm(false);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to save bundle";
      toast.error(msg);
    }
  };

  const handleEdit = (bundle: Bundle) => {
    setEditingBundle(bundle);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    toast.warning("Delete this bundle?", {
      description: "All items in this bundle will also be deleted.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await onDeleteBundle(id);
            toast.success("Bundle deleted");
          } catch (error) {
            const msg = error instanceof Error ? error.message : "Failed to delete bundle";
            toast.error(msg);
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBundle(null);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Bundles</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your inventory bundles</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-150"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Bundle</span>
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
          onCreate={() => setShowForm(true)}
        />
      )}
    </div>
  );
};
