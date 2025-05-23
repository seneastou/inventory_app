import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Configurer la connexion à PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Méthode GET - Récupérer tous les utilisateurs
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM "User" WHERE "isActive" = true');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
}

// Méthode POST - Ajouter un nouvel utilisateur
export async function POST(req: NextRequest) {
  const body = await req.json(); // Récupérer le corps de la requête
  const { name, email, role, companyName } = body;

  if (!email) {
    return NextResponse.json({ error: "Email manquant" }, { status: 400 });
  }

  try {
    // Vérifier si l'utilisateur existe déjà avec cet email
    const userExist = await pool.query('SELECT * FROM "User" WHERE email = $1', [
      email,
    ]);

    if (userExist.rows.length > 0) {
      // L'utilisateur existe déjà, renvoyer ses informations
      return NextResponse.json(userExist.rows[0], { status: 201 });
    }

    const companyResult = await pool.query(
      'SELECT id FROM "Company" WHERE name = $1',
      [companyName]
    );

    let companyId: string;

    if (companyResult.rows.length > 0) {
      companyId = companyResult.rows[0].id;
    } else {
      // Créer la société si elle n'existe pas
      const newCompany = await pool.query(
        `INSERT INTO "Company" ( name) VALUES ($1) RETURNING id`,
        [companyName]
      );
      companyId = newCompany.rows[0].id;
    }

    // Si l'utilisateur n'existe pas, ajouter un nouvel utilisateur
    if (!name || !role) {
      return NextResponse.json(
        { error: "Tous les champs (nom, email, rôle) sont obligatoires" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO "User" (name, email, role, "companyId") VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, role, companyId]
    );

    await pool.query(
      `INSERT INTO "History" (action, "createdAt", "userId", "productId", quantity)
       VALUES ($1, NOW(), $2, NULL, NULL)`,
      ["Utilisateur créé", result.rows[0].id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de l'utilisateur" },
      { status: 500 }
    );
  }
}


