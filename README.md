# Ukay-Ukay Tracker 🛍️

A complete Next.js web application for tracking inventory, costs, and profits for ukay-ukay (thrift) businesses. Built with Next.js App Router, TypeScript, Tailwind CSS, and localStorage for data persistence.

## Features

### 📦 Bundle-Based Inventory Management
- Create and manage inventory bundles (e.g., "Verde V4", "Pb-05", "Dimes")
- Track total cost per bundle and number of pieces
- Visual progress bars showing cost recovery percentage
- Automatic break-even calculation

### 👕 Item Management
- Add items linked to specific bundles
- Auto-calculate estimated cost from bundle (or customize manually)
- Track item details: size, condition, source, and notes
- Easy "Mark as Sold" functionality with instant updates
- Filter items by bundle

### 💰 Profit Tracking
- **Break-Even Logic**: Sales only count as profit AFTER bundle cost is recovered
- Visual indicators for breakeven status
- Daily revenue and profit tracking
- Bundle profit calculation after costs are covered

### 📊 Dashboard
- Real-time summary cards: Today's Sales, Today's Profit, Active Bundles, Breakeven Bundles
- Bundle overview with progress visualization
- Quick view of cost recovery status

### 📅 Daily Sales Tracking
- Select any date to view sales details
- Automatic revenue and profit calculation per day
- Detailed breakdown of items sold

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks (useState, useEffect)
- **Storage**: localStorage (no backend required)
- **Responsive**: Mobile-friendly design

## Installation & Setup

1. **Navigate to the project directory**:
   ```bash
   cd ukay-tracker
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

### 1. Create Your First Bundle
1. Go to the **Bundles** tab
2. Click **"+ New Bundle"**
3. Fill in:
   - Bundle Name (e.g., "Verde V4")
   - Category (Jackets, Hoodies, T-Shirts, Mixed)
   - Total Bundle Cost (₱)
   - Total Pieces in bundle
4. Click **"Create Bundle"**

### 2. Add Items to a Bundle
1. Go to the **Items** tab
2. Click **"+ Add Item"**
3. Select the bundle you created
4. Fill in item details:
   - Item Name (e.g., "Denim Jacket")
   - Selling Price (₱)
   - Size (e.g., "L", "XL")
   - Condition (As New, Excellent, Good, With Issue, Reject)
   - Source (Mine, Gift, Partial payment, Credit)
   - Estimated Cost (auto-calculated from bundle)
5. Click **"Add Item"**

### 3. Track Sales
1. Go to the **Items** tab
2. Find an available item
3. Click **"Mark Sold"**
4. Enter the sold price (or use the list price)
5. The bundle sales update instantly!

### 4. Monitor Progress
1. Check the **Dashboard** for:
   - Today's sales and profit
   - Bundle progress bars
   - Break-even status
2. Go to **Daily Sales** to see detailed sales records

## Break-Even Logic Explained

The break-even system ensures you know your **true profit**:

### How It Works:

1. **Bundle Cost Recovery**: When an item is sold, the money first goes toward recovering the bundle's total cost.

2. **Break-Even Point**: Once total sales ≥ bundle cost, you've reached break-even.

3. **Profit Calculation**: Only AFTER break-even does additional revenue count as profit.

### Example:
```
Bundle: "Verde V4"
Total Cost: ₱6,000
Total Pieces: 20 items

Item Sales:
- Item 1 sold: ₱400 → Remaining to break-even: ₱5,600
- Item 2 sold: ₱450 → Remaining to break-even: ₱5,150
...
- Item 15 sold: ₱500 → Total sales: ₱6,500
  → Bundle cost: ₱6,000
  → Remaining to break-even: ₱-500
  → ✅ Break-even reached!
  → Profit: ₱500

- Item 16 sold: ₱550 → Profit increases to ₱1,050
```

### Visual Indicators:
- **Progress Bar**: Shows % of bundle cost recovered
- **Green Progress**: Break-even reached 🎉
- **Blue Progress**: Still recovering costs
- **"Remaining" Text**: Shows amount needed to break even
- **"Profit" Text**: Shows profit after breakeven

## Profit Calculation Details

Profit is calculated per bundle:

1. **Before Break-Even**: No profit recorded (all sales go to cost recovery)

2. **After Break-Even**: 
   ```
   Profit per item = Sold Price - Estimated Cost per Piece
   ```
   
   Where:
   ```
   Estimated Cost per Piece = Bundle Total Cost / Bundle Total Pieces
   ```

3. **Daily Profit**: Only includes profit from bundles that have already reached break-even

## Data Persistence

All data is stored in your browser's localStorage:
- `ukay-bundles`: All bundle data
- `ukay-items`: All item data

**Note**: Data is only stored on your device. Clearing browser data will delete all records. Consider exporting data before clearing.

## Project Structure

```
ukay-tracker/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main app with tabs navigation
│   └── globals.css         # Global styles
├── components/
│   ├── Dashboard.tsx       # Dashboard with summary cards
│   ├── BundleManager.tsx   # Bundle management container
│   ├── BundleForm.tsx      # Create/edit bundle form
│   ├── BundleList.tsx      # List all bundles with stats
│   ├── ItemManager.tsx     # Item management container
│   ├── ItemForm.tsx        # Create/edit item form
│   ├── ItemList.tsx        # List items (available & sold)
│   └── DailySales.tsx      # Daily sales tracking
├── hooks/
│   └── useLocalStorage.ts  # Custom hook for localStorage
├── lib/
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript interfaces
└── README.md
```

## Features in Detail

### Bundle Cards Display:
- Bundle Name & Category
- Total Cost & Pieces
- Visual Progress Bar (% recovered)
- Current Sales Amount
- Remaining to Break-even OR Profit (after breakeven)
- Unsold item count

### Item Status Tracking:
- **Available**: Ready to sell
- **Sold**: Sold on specific date with price
- Easy "Mark as Sold" button prompts for sold price
- Undo sale to return item to available status

### Daily Sales View:
- Date picker to select any day
- Revenue calculation (total sales)
- Profit calculation (after breakeven)
- Detailed list of items sold that day
- Comparison of list price vs sold price

## Mobile Responsiveness

The application is fully responsive:
- Touch-friendly buttons and inputs
- Collapsible navigation on mobile
- Optimized card layouts for small screens
- Easy one-handed "Mark as Sold" action

## Currency

All prices are displayed in Philippine Peso (₱) with proper formatting.

## Future Enhancements (Optional)

Potential features to add later:
- Data export/import (JSON/CSV)
- Charts and graphs for sales trends
- Multiple user support with authentication
- Cloud sync (Firebase/Supabase)
- Barcode scanning for inventory
- Price history tracking per item
- Expense tracking beyond bundle costs
- Customer database and repeat purchase tracking

## Troubleshooting

**Data not saving?**
- Check browser localStorage permissions
- Ensure you're not in private/incognito mode
- Check browser console for errors

**Break-even not updating?**
- Refresh the page
- Check that items have correct sold prices
- Verify bundle cost is set correctly

## License

This project is built for educational and commercial use for ukay-ukay business owners.

---

**Built with ❤️ for Filipino ukay-ukay entrepreneurs**
