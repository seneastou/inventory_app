import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Configurer la connexion à PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "inventaire",
  password: "scorpion",
  port: 5432,
});

// Méthode GET - Récupérer toutes les catégories
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM categories");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories" },
      { status: 500 }
    );
  }
}

// Méthode GET - Récupérer une catégorie par son ID
export async function GET_id(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  try {
    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
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

// Méthode POST - Ajouter une nouvelle catégorie
export async function POST(req: NextRequest) {
  const body = await req.json(); // Récupérer le corps de la requête
  const { name } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Le nom de la catégorie est obligatoire" },
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de la catégorie" },
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
      "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
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
export async function DELETE(req: NextRequest) {
  // Récupérer les paramètres de la requête (searchParams)
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id"); // Récupérer l'ID dans l'URL ?id=5

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  try {
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);
    return NextResponse.json(
      { message: "Catégorie supprimé avec succès" },
      { status: 204 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression du produit" },
      { status: 500 }
    );
  }
}
