import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function GET(req: NextRequest) {
  const userCookie = req.cookies.get('user_session')

  if (!userCookie) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  }

  const { userId } = JSON.parse(userCookie.value)

  const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [userId])

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}
