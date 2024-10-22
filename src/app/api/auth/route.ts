import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "inventaire",
  password: "scorpion",
  port: 5432,
});

// API pour récupérer l'utilisateur connecté
export async function GET(req: NextRequest) {
  try {
    const userCookie = req.cookies.get("user_session"); // Récupérer le cookie de session

    if (!userCookie) {
      return NextResponse.json(
        { error: "Utilisateur non connecté" },
        { status: 401 }
      );
    }

    const sessionUser = JSON.parse(userCookie.value);
    const userId = sessionUser.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID manquant dans la session" },
        { status: 400 }
      );
    }

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'utilisateur" },
      { status: 500 }
    );
  }
}
