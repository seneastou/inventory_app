import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Configurer la connexion à PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

