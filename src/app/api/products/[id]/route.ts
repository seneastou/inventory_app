import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'inventaire',
  password: 'scorpion',
  port: 5432,
});

// Méthode GET - Récupérer un produit spécifique par ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const result = await pool.query(
      `SELECT p.*, c.name as categoryname
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération du produit' }, { status: 500 });
  }
}
// Supprimer un produit par son ID

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Produit supprimé avec succès' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression du produit' }, { status: 500 });
  }
}

// Méthode PUT - Mettre à jour un produit par son ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const body = await req.json();
    const { name, description, price, instock, categoryname, userid } = body;

    if (!id || !name || !description || !price || !categoryname || !userid) {
      return NextResponse.json({ error: 'Tous les champs sont obligatoires' }, { status: 400 });
    }

    // Assure-toi que la catégorie existe et récupère son ID
    const categoryResult = await pool.query(
      'SELECT id FROM categories WHERE name = $1',
      [categoryname]
    );
    let categoryId = categoryResult.rows[0]?.id;

    if (!categoryId) {
      const newCategory = await pool.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING id',
        [categoryname]
      );
      categoryId = newCategory.rows[0].id;
    }

    // Mettre à jour le produit
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, instock = $4, category_id = $5, userid = $6 WHERE id = $7 RETURNING *',
      [name, description, price, instock, categoryId, userid, id]
    );

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du produit' }, { status: 500 });
  }
}
