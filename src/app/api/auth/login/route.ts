import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email requis' }, { status: 400 })
  }

  const result = await pool.query(
    'SELECT * FROM "User" WHERE email = $1 AND "isActive" = true',
    [email]
  )

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Utilisateur introuvable ou inactif' }, { status: 404 })
  }

  const user = result.rows[0]

  const response = NextResponse.json({ message: 'Connexion réussie', user })
  response.cookies.set('user_session', JSON.stringify({ userId: user.id }), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24,
  })

  return response
}
