import { NextResponse, NextRequest } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ GET – Récupérer les actions liées à une entreprise via les utilisateurs
export async function GET(req: NextRequest) {
  try {
    const companyId = req.nextUrl.searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ error: "Paramètre companyId manquant" }, { status: 400 });
    }

    const result = await pool.query(`
      SELECT h.*, u.name AS "userName", u."companyId", p.name AS "productName"
      FROM "History" h
      JOIN "User" u ON h."userId" = u.id
      LEFT JOIN "Product" p ON h."productId" = p.id
      WHERE u."companyId" = $1
      ORDER BY h."createdAt" DESC
    `, [companyId]);

    const data = result.rows.map((row) => ({
      id: row.id,
      action: row.action,
      quantity: row.quantity,
      createdAt: row.createdAt,
      userId: row.userId,
      user: { name: row.userName },
      product: row.productName ? { name: row.productName } : undefined,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur historique :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// ✅ POST – Enregistrer une action (inchangé)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, quantity, userId, productId } = body;

    if (!action || !userId) {
      return NextResponse.json({ error: 'Action et userId requis' }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO "History" (id, action, quantity, "createdAt", "userId", "productId")
       VALUES (gen_random_uuid(), $1, $2, NOW(), $3, $4)`,
      [action, quantity ?? null, userId, productId ?? null]
    );

    return NextResponse.json({ message: "Action enregistrée dans l’historique" });
  } catch (error) {
    console.error('Erreur POST /history :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
