"use client";

import { useState } from "react";
import { useDatabase } from "@/hooks/useDatabase";
import { Dashboard } from "@/components/Dashboard";
import { BundleManager } from "@/components/BundleManager";
import { ItemManager } from "@/components/ItemManager";
import { DailySales } from "@/components/DailySales";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { LayoutDashboard, Package, Shirt, DollarSign, AlertCircle } from "lucide-react";

export default function Home() {
  const { bundles, items, dailySales, addBundle, updateBundle, deleteBundle, addItem, updateItem, deleteItem, addDailySale, deleteDailySale, refresh, isLoading, error } = useDatabase();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "bundles" | "items" | "sales"
  >("dashboard");

  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "bundles" as const, label: "Bundles", icon: Package },
    { id: "items" as const, label: "Items", icon: Shirt },
    { id: "sales" as const, label: "Sales", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Shirt className="w-4 h-4 text-white" />
              </div>
              <span className="text-base sm:text-lg font-semibold text-foreground">
                Ukay Tracker
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <nav className="hidden sm:flex items-center gap-0.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                        activeTab === tab.id
                          ? "bg-accent/10 text-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
        <div className="sm:hidden border-t border-border">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors duration-150 border-b-2 ${
                    activeTab === tab.id
                      ? "border-accent text-accent"
                      : "border-transparent text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {isLoading ? (
            <DashboardSkeleton />
          ) : error ? (
            <div className="bg-card border border-danger/20 rounded-xl p-10 text-center animate-fadeIn">
              <AlertCircle className="w-10 h-10 text-danger mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">Couldn&apos;t load your inventory</p>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-md mx-auto">{error}</p>
              <Button variant="outline" className="mt-5" onClick={() => refresh()}>
                Try again
              </Button>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <Dashboard bundles={bundles} items={items} />
              )}
              {activeTab === "bundles" && (
                <BundleManager
                  bundles={bundles}
                  items={items}
                  onAddBundle={addBundle}
                  onUpdateBundle={updateBundle}
                  onDeleteBundle={deleteBundle}
                  onAddItem={addItem}
                  onUpdateItem={updateItem}
                  onDeleteItem={deleteItem}
                  refresh={refresh}
                />
              )}
              {activeTab === "items" && (
                <ItemManager
                  bundles={bundles}
                  items={items}
                  onAddItem={addItem}
                  onUpdateItem={updateItem}
                  onDeleteItem={deleteItem}
                  refresh={refresh}
                />
              )}
              {activeTab === "sales" && (
                <DailySales
                  items={items}
                  bundles={bundles}
                  dailySales={dailySales}
                  onAddSale={addDailySale}
                  onDeleteSale={deleteDailySale}
                  refresh={refresh}
                />
              )}
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-muted-foreground">
            Ukay Tracker · Built with Next.js & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
