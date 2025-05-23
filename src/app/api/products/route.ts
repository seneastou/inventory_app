import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Connexion PostgreSQL (Railway friendly)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// GET - Récupérer tous les produits avec leur catégorie
export async function GET(req: NextRequest) {
  const userCookie = req.cookies.get('user_session');
  if (!userCookie) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  }

  const { userId } = JSON.parse(userCookie.value);

  try {
    // Récupérer la companyId de l'utilisateur
    const userResult = await pool.query(
      `SELECT "companyId" FROM "User" WHERE id = $1`,
      [userId]
    );

    const companyId = userResult.rows[0]?.companyId;

    if (!companyId) {
      return NextResponse.json({ error: "Aucune entreprise associée" }, { status: 403 });
    }

    // Renvoyer les produits liés à cette entreprise
    const productResult = await pool.query(
      `SELECT p.*, c.name AS "categoryName"
       FROM "Product" p
       JOIN "Category" c ON c.id = p."categoryId"
       WHERE p."companyId" = $1
       ORDER BY p."createdAt" DESC`,
      [companyId]
    );

    return NextResponse.json(productResult.rows);
  } catch (error) {
    console.error("Erreur GET /products:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}


// POST - Ajouter un produit
export async function POST(req: NextRequest) {
  const userCookie = req.cookies.get('user_session');
  if (!userCookie) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  }

  const { userId } = JSON.parse(userCookie.value);
  const {
    name,
    description,
    price,
    inStock,
    categoryName
  } = await req.json();

  // Validation
  if (!name || !description || !price || !categoryName) {
    return NextResponse.json(
      { error: "Tous les champs sont obligatoires" },
      { status: 400 }
    );
  }

  try {
    // Récupérer companyId du user
    const userResult = await pool.query(
      `SELECT "companyId" FROM "User" WHERE id = $1`,
      [userId]
    );

    const companyId = userResult.rows[0]?.companyId;

    if (!companyId) {
      return NextResponse.json({ error: "Utilisateur sans société" }, { status: 403 });
    }

    // Gérer la catégorie
    const categoryResult = await pool.query(
      `SELECT id FROM "Category" WHERE name = $1`,
      [categoryName]
    );

    let categoryId;
    if (categoryResult.rows.length > 0) {
      categoryId = categoryResult.rows[0].id;
    } else {
      const newCat = await pool.query(
        `INSERT INTO "Category" (name) VALUES ($1) RETURNING id`,
        [categoryName]
      );
      categoryId = newCat.rows[0].id;
    }

    // Insérer le produit avec la companyId du user
    const result = await pool.query(
      `INSERT INTO "Product" (name, description, price, "inStock", "categoryId", "userId", "companyId", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [name, description, price, inStock, categoryId, userId, companyId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Erreur POST /products :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
