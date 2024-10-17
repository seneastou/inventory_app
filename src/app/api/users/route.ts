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
    // Récupérer tous les utilisateurs
    try {
      const result = await pool.query('SELECT * FROM users');
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
  } else if (req.method === 'POST') {
    // Ajouter un nouvel utilisateur
    const { name, email, role } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *`,
        [name, email, role]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur' });
    }
  } else if (req.method === 'PUT') {
    // Modifier un utilisateur existant
    const { id, name, email, role } = req.body;
    try {
      const result = await pool.query(
        `UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *`,
        [name, email, role, id]
      );
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la modification de l\'utilisateur' });
    }
  } else if (req.method === 'DELETE') {
    // Supprimer un utilisateur
    const { id }: { id: number } = req.body;
    try {
      await pool.query('DELETE FROM users WHERE id = $1', [id]);
      res.status(204).end();  // Pas de contenu à retourner après suppression
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}



