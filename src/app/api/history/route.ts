import { NextResponse, NextRequest } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT h.*, u.name AS "userName", p.name AS "productName"
      FROM "History" h
      JOIN "User" u ON h."userId" = u.id
      LEFT JOIN "Product" p ON h."productId" = p.id
      ORDER BY h."createdAt" DESC
    `)

    const data = result.rows.map((row) => ({
      id: row.id,
      action: row.action,
      quantity: row.quantity,
      createdAt: row.createdAt,
      user: { name: row.userName },
      product: row.productName ? { name: row.productName } : undefined,
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur historique :', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST – Enregistrer une nouvelle action
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, quantity, userId, productId } = body

    if (!action || !userId) {
      return NextResponse.json({ error: 'Action et userId requis' }, { status: 400 })
    }

    await pool.query(
      `INSERT INTO "History" (id, action, quantity, "createdAt", "userId", "productId")
       VALUES (gen_random_uuid(), $1, $2, NOW(), $3, $4)`,
      [action, quantity ?? null, userId, productId ?? null]
    )

    return NextResponse.json({ message: 'Action enregistrée dans l’historique' })
  } catch (error) {
    console.error('Erreur POST /history :', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}