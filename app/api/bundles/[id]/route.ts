import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bundle = await request.json();
    
    const { rows } = await sql`
      UPDATE bundles
      SET 
        name = ${bundle.name},
        category = ${bundle.category},
        total_cost = ${bundle.totalCost},
        total_pieces = ${bundle.totalPieces}
      WHERE id = ${params.id}
      RETURNING *
    `;
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Bundle not found' }, { status: 404 });
    }
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating bundle:', error);
    return NextResponse.json({ error: 'Failed to update bundle' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { rows } = await sql`
      DELETE FROM bundles WHERE id = ${params.id} RETURNING *
    `;
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Bundle not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bundle:', error);
    return NextResponse.json({ error: 'Failed to delete bundle' }, { status: 500 });
  }
}
