import { Bundle, Item, BundleStats } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateBundleStats(
  bundle: Bundle,
  items: Item[]
): BundleStats {
  const bundleItems = items.filter((item) => item.bundleId === bundle.id);
  const soldItems = bundleItems.filter((item) => item.status === "Sold");

  const totalSales = soldItems.reduce(
    (sum, item) => sum + (item.soldPrice || 0),
    0
  );
  const remainingToBreakeven = bundle.totalCost - totalSales;
  const isBreakeven = remainingToBreakeven <= 0;
  const profit = isBreakeven ? totalSales - bundle.totalCost : 0;
  const unsoldCount = bundleItems.filter(
    (item) => item.status === "Available"
  ).length;
  const progressPercent = Math.min((totalSales / bundle.totalCost) * 100, 100);

  return {
    totalSales,
    remainingToBreakeven,
    isBreakeven,
    profit,
    unsoldCount,
    progressPercent,
  };
}

export const formatCurrency = (amount: number) =>
  `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000;

/** Calendar date in Asia/Manila as YYYY-MM-DD. PH has no DST, so UTC+8 is exact. */
export function getLocalDateString(date: Date = new Date()): string {
  return new Date(date.getTime() + MANILA_OFFSET_MS).toISOString().slice(0, 10);
}

/**
 * Profit for a calendar day: remaining bundle cost is recovered first.
 * Only leftover pesos from that day's sales count as profit.
 */
export function calculateDailyProfit(
  date: string,
  bundles: Bundle[],
  items: Item[]
): number {
  const daySales = items.filter(
    (item) => item.status === "Sold" && item.soldDate === date
  );

  const byBundle = new Map<string, number>();
  for (const item of daySales) {
    byBundle.set(
      item.bundleId,
      (byBundle.get(item.bundleId) || 0) + (item.soldPrice || 0)
    );
  }

  let profit = 0;
  for (const [bundleId, todaysRevenue] of byBundle) {
    const bundle = bundles.find((b) => b.id === bundleId);
    if (!bundle) continue;

    const salesBefore = items
      .filter(
        (i) =>
          i.bundleId === bundleId &&
          i.status === "Sold" &&
          i.soldDate &&
          i.soldDate < date
      )
      .reduce((sum, i) => sum + (i.soldPrice || 0), 0);

    const remainingCost = Math.max(0, bundle.totalCost - salesBefore);
    profit += Math.max(0, todaysRevenue - remainingCost);
  }

  return profit;
}

function csvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Download a UTF-8 CSV of bundles joined to their items (Excel-friendly BOM). */
export function downloadInventoryCsv(bundles: Bundle[], items: Item[]): void {
  const headers = [
    "Bundle Name",
    "Category",
    "Bundle Cost",
    "Bundle Pieces",
    "Item Name",
    "Size",
    "Condition",
    "Source",
    "Status",
    "List Price",
    "Sold Price",
    "Sold Date",
    "Estimated Cost",
    "Issue Notes",
    "Sold Notes",
    "Created At",
  ];

  const rows: string[] = [headers.map(csvCell).join(",")];

  for (const bundle of bundles) {
    const bundleItems = items.filter((i) => i.bundleId === bundle.id);
    if (bundleItems.length === 0) {
      rows.push(
        [
          bundle.name,
          bundle.category,
          bundle.totalCost,
          bundle.totalPieces,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          bundle.createdAt,
        ]
          .map(csvCell)
          .join(",")
      );
      continue;
    }

    for (const item of bundleItems) {
      rows.push(
        [
          bundle.name,
          bundle.category,
          bundle.totalCost,
          bundle.totalPieces,
          item.name,
          item.size,
          item.condition,
          item.source,
          item.status,
          item.sellingPrice,
          item.soldPrice,
          item.soldDate,
          item.estimatedCost,
          item.issueNotes,
          item.soldNotes,
          item.createdAt,
        ]
          .map(csvCell)
          .join(",")
      );
    }
  }

  const blob = new Blob(["\uFEFF" + rows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ukay-inventory-${getLocalDateString()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
