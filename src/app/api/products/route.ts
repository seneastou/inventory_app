import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// Configurer la connexion à PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'inventaire',
  password: 'scorpion',
  port: 5432,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Récupérer tous les produits
    try {
      const result = await pool.query('SELECT * FROM products');
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
  } else if (req.method === 'POST') {
    // Ajouter un nouveau produit
    const { name, description, price, inStock, categoryId, userId } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO products (name, description, price, in_stock, category_id, user_id, created_at) 
        VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
        [name, description, price, inStock, categoryId, userId]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'ajout du produit' });
    }
  } else if (req.method === 'PUT') {
    // Modifier un produit
    const { id, name, description, price, inStock, categoryId, userId } = req.body;
    try {
      const result = await pool.query(
        `UPDATE products 
         SET name = $1, description = $2, price = $3, in_stock = $4, category_id = $5, user_id = $6 
         WHERE id = $7 RETURNING *`,
        [name, description, price, inStock, categoryId, userId, id]
      );
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la modification du produit' });
    }
  } else if (req.method === 'DELETE') {
    // Supprimer un produit
    const { id }: { id: number } = req.body;
    try {
      await pool.query('DELETE FROM products WHERE id = $1', [id]);
      res.status(204).end();  // Pas de contenu à retourner après suppression
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
