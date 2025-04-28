
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'inventaire',
  password: 'scorpion',
  port: 5432,
});

// Gestion des requêtes GET pour récupérer l'utilisateur connecté
// export async function GET(req: NextRequest) {
//   // Vérification du chemin pour savoir si on demande les informations de l'utilisateur connecté
//   const url = new URL(req.url);
//   if (url.pathname === '/api/auth/me') {
//     const userCookie = req.cookies.get('user_session'); // Récupérer le cookie de session

//     if (!userCookie) {
//       return NextResponse.json({ error: 'Utilisateur non connecté' }, { status: 401 });
//     }

//     const sessionUser = JSON.parse(userCookie.value);
//     const userId = sessionUser.userId;

//     if (!userId) {
//       return NextResponse.json({ error: 'User ID manquant dans la session' }, { status: 400 });
//     }

//     const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

//     if (result.rows.length === 0) {
//       return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
//     }

//     return NextResponse.json(result.rows[0], { status: 200 });
//   }

//   return NextResponse.json({ error: 'Route non trouvée' }, { status: 404 });
// }

// Gestion des requêtes POST pour l'authentification par email
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json(); // Récupérer uniquement l'email depuis la requête

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Email incorrect' }, { status: 401 });
    }

    const user = result.rows[0];
    const sessionUser = { userId: user.id };

    // Définir un cookie de session avec l'ID utilisateur
    const response = NextResponse.json(user, { status: 200 });
    response.cookies.set('user_session', JSON.stringify(sessionUser), { httpOnly: true });

    return response;
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return NextResponse.json({ error: 'Erreur lors de la connexion' }, { status: 500 });
  }
}

