import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT 
        id,
        name,
        category,
        total_cost as "totalCost",
        total_pieces as "totalPieces",
        created_at as "createdAt"
      FROM bundles 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching bundles:', error);
    return NextResponse.json({ error: 'Failed to fetch bundles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const bundle = await request.json();
    
    const { rows } = await sql`
      INSERT INTO bundles (id, name, category, total_cost, total_pieces, created_at)
      VALUES (
        ${bundle.id},
        ${bundle.name},
        ${bundle.category},
        ${bundle.totalCost},
        ${bundle.totalPieces},
        ${bundle.createdAt}
      )
      RETURNING *
    `;
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error creating bundle:', error);
    return NextResponse.json({ error: 'Failed to create bundle' }, { status: 500 });
  }
}
