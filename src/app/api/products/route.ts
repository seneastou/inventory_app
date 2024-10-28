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

// Méthode GET - Récupérer tous les produits avec le nom de la catégorie
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as categoryname 
      FROM products p 
      JOIN categories c ON p.category_id = c.id
    `);
    return NextResponse.json(result.rows || []);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}


// Méthode POST - Ajouter un nouveau produit avec gestion de la catégorie

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, price, instock, categoryname, userid } = body;
  console.log(body);

  if (!name || !description || !price || !categoryname || !userid) {
    return NextResponse.json(
      { error: "Tous les champs sont obligatoires" },
      { status: 400 }
    );
  }

  try {
    // Vérifier si la catégorie existe déjà dans la base de données
    const categoryResult = await pool.query(
      "SELECT id FROM categories WHERE name = $1",
      [categoryname]
    );

    let category_id;

    // Si la catégorie existe, utiliser son ID
    if (categoryResult.rows.length > 0) {
      category_id = categoryResult.rows[0].id;
    } else {
      // Si la catégorie n'existe pas, la créer
      const newCategory = await pool.query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING id",
        [categoryname]
      );
      category_id = newCategory.rows[0].id; // Récupérer l'ID de la nouvelle catégorie
    }

    // Insérer le nouveau produit avec l'ID de la catégorie récupérée ou créée
    const result = await pool.query(
      "INSERT INTO products (name, description, price, instock, category_id, userid, createdat) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *",
      [name, description, price, instock, category_id, userid]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout du produit" },
      { status: 500 }
    );
  }
}
