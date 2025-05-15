import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    await pool.query('UPDATE "User" SET "isActive" = true WHERE id = $1', [id])
    return NextResponse.json({ message: 'Utilisateur réactivé avec succès' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la réactivation' }, { status: 500 })
  }
}
