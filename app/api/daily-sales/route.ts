import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT 
        ds.id,
        ds.date,
        ds.total_revenue as "totalRevenue",
        ds.created_at as "createdAt",
        COALESCE(
          json_agg(
            json_build_object(
              'id', dsii.item_id
            ) ORDER BY dsii.item_id
          ) FILTER (WHERE dsii.item_id IS NOT NULL),
          '[]'::json
        ) as "items"
      FROM daily_sales ds
      LEFT JOIN daily_sales_items dsii ON ds.id = dsii.daily_sale_id
      GROUP BY ds.id
      ORDER BY ds.date DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    return NextResponse.json({ error: 'Failed to fetch daily sales' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sale = await request.json();
    
    await sql.query('BEGIN');
    
    const { rows } = await sql`
      INSERT INTO daily_sales (id, date, total_revenue, created_at)
      VALUES (${sale.id}, ${sale.date}, ${sale.totalRevenue}, ${sale.createdAt})
      RETURNING *
    `;
    
    if (sale.items && sale.items.length > 0) {
      for (const itemId of sale.items) {
        await sql`
          INSERT INTO daily_sales_items (daily_sale_id, item_id)
          VALUES (${sale.id}, ${itemId})
        `;
      }
      
      await sql`
        UPDATE items
        SET status = 'Sold', sold_date = ${sale.date}
        WHERE id = ANY(${sale.items})
      `;
    }
    
    await sql.query('COMMIT');
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    await sql.query('ROLLBACK');
    console.error('Error creating daily sale:', error);
    return NextResponse.json({ error: 'Failed to create daily sale' }, { status: 500 });
  }
}
