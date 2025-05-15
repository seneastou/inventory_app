import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Configurer la connexion à PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


// Méthode DELETE - Supprimer un utilisateur
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await pool.query(
      'UPDATE "User" SET "isActive" = false WHERE id = $1',
      [id]
    );
    return NextResponse.json({ message: "Utilisateur désactivé avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la désactivation de l'utilisateur :", error);
    return NextResponse.json(
      { error: "Erreur lors de la désactivation de l'utilisateur" },
      { status: 500 }
    );
  }
}

// Méthode PUT - Modifier un utilisateur
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const { role } = body;

  if (!role) {
    return NextResponse.json({ error: "Le rôle est requis" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      'UPDATE "User" SET role = $1 WHERE id = $2 RETURNING *',
      [role, id]
    );
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la modification de l'utilisateur" },
      { status: 500 }
    );
  }
}



// Méthode GET - Récupérer un utilisateur par son ID

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  try {
    const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [
      id,
    ]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'utilisateur" },
      { status: 500 }
    );
  }
}