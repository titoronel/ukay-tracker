export interface Bundle {
  id: string;
  name: string;
  category: 'Jackets' | 'Hoodies' | 'T-Shirts' | 'Mixed';
  totalCost: number;
  totalPieces: number;
  createdAt: string;
}

export interface Item {
  id: string;
  bundleId: string;
  name: string;
  sellingPrice: number;
  estimatedCost?: number;
  size: string;
  condition: 'As New' | 'Excellent' | 'Good' | 'With Issue' | 'Reject';
  issueNotes?: string;
  source: 'Mine' | 'Gift' | 'Partial payment' | 'Credit';
  status: 'Available' | 'Sold';
  soldDate?: string;
  soldPrice?: number;
  createdAt: string;
}

export interface DailySale {
  id: string;
  date: string;
  items: string[];
  totalRevenue: number;
  createdAt: string;
}

export interface BundleStats {
  totalSales: number;
  remainingToBreakeven: number;
  isBreakeven: boolean;
  profit: number;
  unsoldCount: number;
  progressPercent: number;
}
