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
    // Récupérer toutes les catégories
    try {
      const result = await pool.query('SELECT * FROM categories');
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
    }
  } else if (req.method === 'POST') {
    // Ajouter une nouvelle catégorie
    const { name } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING *',
        [name]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'ajout de la catégorie' });
    }
  } else if (req.method === 'PUT') {
    // Modifier une catégorie
    const { id, name } = req.body;
    try {
      const result = await pool.query(
        'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
        [name, id]
      );
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la modification de la catégorie' });
    }
  } else if (req.method === 'DELETE') {
    // Supprimer une catégorie
    const { id } = req.body;
    try {
      await pool.query('DELETE FROM categories WHERE id = $1', [id]);
      res.status(204).end();  // Pas de contenu à retourner après suppression
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de la catégorie' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}

