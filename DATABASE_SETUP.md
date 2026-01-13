# Database Setup Instructions

This application uses **Vercel Postgres** (powered by Neon) for persistent data storage.

## Step 1: Set up Vercel Postgres

1. Go to your Vercel project dashboard
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **Postgres** and choose a region
5. Click **Create**

## Step 2: Connect to the Database

After creating the database, Vercel will provide connection details:

1. Click on your new database in the Storage tab
2. Copy the **POSTGRES_URL** from the connection strings
3. Add it to your `.env.local` file:

```bash
POSTGRES_URL=your_connection_string_here
```

## Step 3: Initialize the Database Schema

Run the SQL schema to create the necessary tables:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx tsx -e "
import { sql } from '@vercel/postgres';

const schema = \`-- Create bundles table
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
);\`

await sql.query(schema);
console.log('Database schema created successfully');
"
```

## Step 4: Deploy

Push your changes to GitHub and deploy to Vercel:

```bash
git add .
git commit -m "Add database support"
git push
```

Vercel will automatically detect the environment variables and set up the database connection.

## Database Schema

The database has the following tables:

- **bundles**: Store inventory bundle information
- **items**: Individual items with their bundle association
- **daily_sales**: Sales records by date
- **daily_sales_items**: Junction table linking sales to items

## Benefits

- **Persistent storage**: Data won't be lost when clearing browser cache
- **Automatic backups**: Vercel Postgres includes automatic backups
- **Scalable**: Can handle large amounts of data
- **Free tier**: 512MB storage for hobby projects

## Troubleshooting

If you encounter connection issues:

1. Verify your `POSTGRES_URL` is correct in `.env.local`
2. Make sure the database is active in your Vercel dashboard
3. Check the Vercel logs for any connection errors
4. Restart your development server after adding the environment variable
