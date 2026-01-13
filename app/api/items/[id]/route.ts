import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await request.json();
    
    const { rows } = await sql`
      UPDATE items
      SET 
        name = ${item.name},
        selling_price = ${item.sellingPrice},
        estimated_cost = ${item.estimatedCost},
        size = ${item.size},
        condition = ${item.condition},
        issue_notes = ${item.issueNotes},
        source = ${item.source},
        status = ${item.status},
        sold_date = ${item.soldDate},
        sold_price = ${item.soldPrice}
      WHERE id = ${params.id}
      RETURNING *
    `;
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { rows } = await sql`
      DELETE FROM items WHERE id = ${params.id} RETURNING *
    `;
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
