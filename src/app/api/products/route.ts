import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Connexion PostgreSQL (Railway friendly)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// GET - Récupérer tous les produits avec leur catégorie
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name AS "categoryName" 
      FROM "Product" p 
      JOIN "Category" c ON p."categoryId" = c.id
    `);

    const products = result.rows.map((p) => ({
      ...p,
      createdAt: p.createdAt?.toISOString(), // 🔥 conversion ici
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}

// POST - Ajouter un produit
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Pas de renommage ici — garder la même casse que le front
  const {
    name,
    description,
    price,
    inStock,
    categoryName,
    userId
  } = body;

  // Validation
  if (!name || !description || !price || !categoryName || !userId) {
    return NextResponse.json(
      { error: "Tous les champs sont obligatoires" },
      { status: 400 }
    );
  }

  try {
    // Vérifier si la catégorie existe déjà
    const categoryResult = await pool.query(
      `SELECT id FROM "Category" WHERE name = $1`,
      [categoryName]
    );

    let categoryId;

    if (categoryResult.rows.length > 0) {
      categoryId = categoryResult.rows[0].id;
    } else {
      // Créer la catégorie si elle n'existe pas
      const newCategory = await pool.query(
        `INSERT INTO "Category" (name) VALUES ($1) RETURNING id`,
        [categoryName]
      );
      categoryId = newCategory.rows[0].id;
    }

    // Insérer le produit
    const result = await pool.query(
      `INSERT INTO "Product" (name, description, price, "inStock", "categoryId", "userId", "createdAt") 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [name, description, price, inStock, categoryId, userId]
    );

    // Convertir la date et ajouter le nom de la catégorie
    const product = result.rows[0];
    product.createdAt = product.createdAt?.toISOString();
    product.categoryName = categoryName;

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout du produit" },
      { status: 500 }
    );
  }
}
