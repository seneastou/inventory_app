import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";


// Configurer la connexion à PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
// Méthode GET - Récupérer une catégorie par son ID
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  try {
    const result = await pool.query('SELECT * FROM "Category" WHERE id = $1', [
      id,
    ]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la catégorie" },
      { status: 500 }
    );
  }
}

// Méthode PUT - Modifier une catégorie existante
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, name } = body;

  if (!id || !name) {
    return NextResponse.json(
      { error: "L'ID et le nom de la catégorie sont obligatoires" },
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      'UPDATE "Category" SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la modification de la catégorie" },
      { status: 500 }
    );
  }
}

// Méthode DELETE - Supprimer une catégorie
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;


  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  try {
    await pool.query('DELETE FROM "Category" WHERE id = $1', [id]);
    return NextResponse.json(
      { message: "Catégorie supprimé avec succès" },
      { status: 204 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la catégorie" },
      { status: 500 }
    );
  }
}
