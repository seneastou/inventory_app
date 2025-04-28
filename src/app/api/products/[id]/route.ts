import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// GET - Récupérer un produit spécifique par ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const result = await pool.query(
      `SELECT p.*, c.name as categoryName
       FROM "Product" p
       JOIN "Category" c ON p."categoryId" = c.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
    }

    //  Convertir createdAt en string
    const product = result.rows[0];
    return NextResponse.json({
      ...product,
      createdAt: product.createdAt?.toISOString() || null,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération du produit' }, { status: 500 });
  }
}

// DELETE - Supprimer un produit par son ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await pool.query('DELETE FROM "Product" WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Produit supprimé avec succès' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression du produit' }, { status: 500 });
  }
}

// PUT - Mettre à jour un produit par son ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();

  // Déstructuration avec alias vers minuscule
  const {
    name,
    description,
    price,
    inStock: instock,
    categoryName: categoryname,
    userId: userid,
  } = body;

  // Validation
  if (!id || !name || !description || !price || !categoryname || !userid) {
    return NextResponse.json({ error: "Tous les champs sont obligatoires" }, { status: 400 });
  }

  try {
    // Vérifier si la catégorie existe
    const categoryResult = await pool.query(
      `SELECT id FROM "Category" WHERE name = $1`,
      [categoryname]
    );

    let categoryid = categoryResult.rows[0]?.id;

    if (!categoryid) {
      const newCategory = await pool.query(
        `INSERT INTO "Category" (name) VALUES ($1) RETURNING id`,
        [categoryname]
      );
      categoryid = newCategory.rows[0].id;
    }

    // Mettre à jour le produit
    const result = await pool.query(
      `UPDATE "Product"
       SET name = $1, description = $2, price = $3, "inStock" = $4, "categoryId" = $5, "userId" = $6
       WHERE id = $7
       RETURNING *`,
      [name, description, price, instock, categoryid, userid, id]
    );

    const product = result.rows[0];
    product.createdAt = product.createdAt?.toISOString();

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit :", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du produit" },
      { status: 500 }
    );
  }
}
