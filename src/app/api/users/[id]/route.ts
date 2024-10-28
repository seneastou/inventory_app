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


// Méthode DELETE - Supprimer un utilisateur
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return NextResponse.json({ message: "Utilisateur supprimé avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de users"},
      { status: 500 }
    );
  }
}
