"use client";

import { useState } from "react";
import { useDatabase } from "@/hooks/useDatabase";
import { Dashboard } from "@/components/Dashboard";
import { BundleManager } from "@/components/BundleManager";
import { ItemManager } from "@/components/ItemManager";
import { DailySales } from "@/components/DailySales";

export default function Home() {
  const { bundles, items, dailySales, addBundle, updateBundle, deleteBundle, addItem, updateItem, deleteItem, addDailySale, deleteDailySale, refresh } = useDatabase();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "bundles" | "items" | "sales"
  >("dashboard");

  const tabs = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: "📊",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "bundles" as const,
      label: "Bundles",
      icon: "📦",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "items" as const,
      label: "Items",
      icon: "👕",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: "sales" as const,
      label: "Sales",
      icon: "💰",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex flex-col">
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>

      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-r from-purple-600/10 to-pink-600/10 backdrop-blur-3xl" />
        <header className="relative border-b border-white/50 bg-white/80 backdrop-blur-xl shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="text-4xl animate-bounce-slow">👔</div>
                <div>
                  <h1 className="text-3xl font-black bg-linear-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    Ukay-Ukay Tracker
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">
                    Track • Manage • Profit
                  </p>
                </div>
              </div>
              <nav className="flex gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/60">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-5 py-3 rounded-xl font-bold transition-all duration-300 ${
                      activeTab === tab.id
                        ? "text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                    }`}
                  >
                    {activeTab === tab.id && (
                      <div
                        className={`absolute inset-0 bg-linear-to-r ${tab.gradient} rounded-xl`}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <span className="text-xl">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
        </div>
      </main>

      <footer className="relative mt-auto border-t border-white/50 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-600">
            <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ukay-Ukay Tracker
            </span>{" "}
            • Powered by Next.js & Tailwind CSS ✨
          </p>
        </div>
      </footer>
    </div>
  );
}
