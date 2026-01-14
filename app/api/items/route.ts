import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT 
        id,
        bundle_id as "bundleId",
        name,
        selling_price as "sellingPrice",
        estimated_cost as "estimatedCost",
        size,
        condition,
        issue_notes as "issueNotes",
        source,
        status,
        sold_date as "soldDate",
        sold_price as "soldPrice",
        created_at as "createdAt"
      FROM items 
      ORDER BY created_at DESC
    `;
    const convertedRows = rows.map(row => ({
      ...row,
      sellingPrice: parseFloat(row.sellingPrice),
      estimatedCost: row.estimatedCost ? parseFloat(row.estimatedCost) : null,
      soldPrice: row.soldPrice ? parseFloat(row.soldPrice) : null
    }));
    return NextResponse.json(convertedRows);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const item = await request.json();
    
    const { rows } = await sql`
      INSERT INTO items (
        id, bundle_id, name, selling_price, estimated_cost, 
        size, condition, issue_notes, source, status, 
        sold_date, sold_price, created_at
      )
      VALUES (
        ${item.id},
        ${item.bundleId},
        ${item.name},
        ${item.sellingPrice},
        ${item.estimatedCost},
        ${item.size},
        ${item.condition},
        ${item.issueNotes},
        ${item.source},
        ${item.status},
        ${item.soldDate},
        ${item.soldPrice},
        ${item.createdAt}
      )
      RETURNING *
    `;
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
