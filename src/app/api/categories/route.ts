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

