import { Bundle, Item, BundleStats } from '@/types';

export function calculateBundleStats(bundle: Bundle, items: Item[]): BundleStats {
  const bundleItems = items.filter(item => item.bundleId === bundle.id);
  const soldItems = bundleItems.filter(item => item.status === 'Sold');
  
  const totalSales = soldItems.reduce((sum, item) => sum + (item.soldPrice || 0), 0);
  const remainingToBreakeven = bundle.totalCost - totalSales;
  const isBreakeven = remainingToBreakeven <= 0;
  const profit = isBreakeven ? totalSales - bundle.totalCost : 0;
  const unsoldCount = bundleItems.filter(item => item.status === 'Available').length;
  const progressPercent = Math.min((totalSales / bundle.totalCost) * 100, 100);

  return {
    totalSales,
    remainingToBreakeven,
    isBreakeven,
    profit,
    unsoldCount,
    progressPercent
  };
}

export function formatCurrency(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
