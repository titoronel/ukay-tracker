import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await sql.query('BEGIN');
    
    await sql`
      UPDATE items
      SET status = 'Available', sold_date = NULL
      WHERE id IN (
        SELECT item_id FROM daily_sales_items WHERE daily_sale_id = ${id}
      )
    `;
    
    const { rows } = await sql`
      DELETE FROM daily_sales WHERE id = ${id} RETURNING *
    `;
    
    await sql.query('COMMIT');
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Daily sale not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    await sql.query('ROLLBACK');
    console.error('Error deleting daily sale:', error);
    return NextResponse.json({ error: 'Failed to delete daily sale' }, { status: 500 });
  }
}
