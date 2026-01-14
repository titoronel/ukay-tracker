import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    if (!process.env.POSTGRES_URL) {
      console.error('POSTGRES_URL environment variable is not set');
      return NextResponse.json({ 
        error: 'Database configuration missing',
        details: 'POSTGRES_URL environment variable is not set' 
      }, { status: 500 });
    }
    
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
    const convertedRows = rows.map(row => ({
      ...row,
      totalCost: parseFloat(row.totalCost),
      totalPieces: parseInt(row.totalPieces)
    }));
    return NextResponse.json(convertedRows);
  } catch (error) {
    console.error('Error fetching bundles:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch bundles',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.POSTGRES_URL) {
      console.error('POSTGRES_URL environment variable is not set');
      return NextResponse.json({ 
        error: 'Database configuration missing',
        details: 'POSTGRES_URL environment variable is not set' 
      }, { status: 500 });
    }
    
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
    return NextResponse.json({ 
      error: 'Failed to create bundle',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
