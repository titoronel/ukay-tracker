-- Create bundles table
CREATE TABLE IF NOT EXISTS bundles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Jackets', 'Hoodies', 'T-Shirts', 'Mixed')),
  total_cost DECIMAL(10,2) NOT NULL,
  total_pieces INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  bundle_id TEXT NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  estimated_cost DECIMAL(10,2),
  size TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('As New', 'Excellent', 'Good', 'With Issue', 'Reject')),
  issue_notes TEXT,
  source TEXT NOT NULL CHECK (source IN ('Mine', 'Gift', 'Partial payment', 'Credit')),
  status TEXT NOT NULL CHECK (status IN ('Available', 'Sold')),
  sold_date TEXT,
  sold_price DECIMAL(10,2),
  created_at TEXT NOT NULL
);

-- Create daily_sales table
CREATE TABLE IF NOT EXISTS daily_sales (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  total_revenue DECIMAL(10,2) NOT NULL,
  created_at TEXT NOT NULL
);

-- Create junction table for daily_sales_items (many-to-many relationship)
CREATE TABLE IF NOT EXISTS daily_sales_items (
  daily_sale_id TEXT NOT NULL REFERENCES daily_sales(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  PRIMARY KEY (daily_sale_id, item_id)
);
