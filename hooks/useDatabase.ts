'use client';

import { useState, useEffect } from 'react';
import { Bundle, Item, DailySale } from '@/types';

export function useDatabase() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [dailySales, setDailySales] = useState<DailySale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [bundlesRes, itemsRes, salesRes] = await Promise.all([
        fetch('/api/bundles'),
        fetch('/api/items'),
        fetch('/api/daily-sales')
      ]);

      if (!bundlesRes.ok) {
        const errorData = await bundlesRes.json().catch(() => ({}));
        console.error('Bundles API error:', errorData);
        throw new Error(`Bundles error: ${errorData.details || errorData.error || 'Unknown error'}`);
      }
      if (!itemsRes.ok) {
        const errorData = await itemsRes.json().catch(() => ({}));
        console.error('Items API error:', errorData);
        throw new Error(`Items error: ${errorData.details || errorData.error || 'Unknown error'}`);
      }
      if (!salesRes.ok) {
        const errorData = await salesRes.json().catch(() => ({}));
        console.error('Sales API error:', errorData);
        throw new Error(`Sales error: ${errorData.details || errorData.error || 'Unknown error'}`);
      }

      const [bundlesData, itemsData, salesData] = await Promise.all([
        bundlesRes.json(),
        itemsRes.json(),
        salesRes.json()
      ]);

      setBundles(bundlesData);
      setItems(itemsData);
      setDailySales(salesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addBundle = async (bundle: Bundle) => {
    try {
      const res = await fetch('/api/bundles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bundle)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Add bundle error:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to add bundle');
      }
      await fetchAll();
    } catch (err) {
      console.error('Error adding bundle:', err);
      throw err;
    }
  };

  const updateBundle = async (bundle: Bundle) => {
    try {
      const res = await fetch(`/api/bundles/${bundle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bundle)
      });
      if (!res.ok) throw new Error('Failed to update bundle');
      await fetchAll();
    } catch (err) {
      console.error('Error updating bundle:', err);
      throw err;
    }
  };

  const deleteBundle = async (id: string) => {
    try {
      const res = await fetch(`/api/bundles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete bundle');
      await fetchAll();
    } catch (err) {
      console.error('Error deleting bundle:', err);
      throw err;
    }
  };

  const addItem = async (item: Item) => {
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!res.ok) throw new Error('Failed to add item');
      await fetchAll();
    } catch (err) {
      console.error('Error adding item:', err);
      throw err;
    }
  };

  const updateItem = async (item: Item) => {
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!res.ok) throw new Error('Failed to update item');
      await fetchAll();
    } catch (err) {
      console.error('Error updating item:', err);
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
      await fetchAll();
    } catch (err) {
      console.error('Error deleting item:', err);
      throw err;
    }
  };

  const addDailySale = async (sale: DailySale) => {
    try {
      const res = await fetch('/api/daily-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sale)
      });
      if (!res.ok) throw new Error('Failed to add daily sale');
      await fetchAll();
    } catch (err) {
      console.error('Error adding daily sale:', err);
      throw err;
    }
  };

  const deleteDailySale = async (id: string) => {
    try {
      const res = await fetch(`/api/daily-sales/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete daily sale');
      await fetchAll();
    } catch (err) {
      console.error('Error deleting daily sale:', err);
      throw err;
    }
  };

  return {
    bundles,
    items,
    dailySales,
    isLoading,
    error,
    addBundle,
    updateBundle,
    deleteBundle,
    addItem,
    updateItem,
    deleteItem,
    addDailySale,
    deleteDailySale,
    refresh: fetchAll
  };
}
