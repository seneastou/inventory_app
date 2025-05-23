import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // ✅ Réactivation de l'utilisateur
    const result = await pool.query(
      `UPDATE "User" SET "isActive" = true WHERE id = $1 RETURNING *`,
      [id]
    );
    const updatedUser = result.rows[0];

    // ✅ Enregistrement dans l'historique
    await pool.query(
      `INSERT INTO "History" (id, action, quantity, "userId", "productId", "createdAt")
       VALUES (uuid_generate_v4(), $1, NULL, $2, NULL, NOW())`,
      ["Utilisateur réactivé", id]
    );

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la réactivation :", error);
    return NextResponse.json(
      { error: "Impossible de réactiver l'utilisateur" },
      { status: 500 }
    );
  }
}
