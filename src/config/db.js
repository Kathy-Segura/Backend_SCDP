import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('Conectado a PostgreSQL');
});
// Cada nueva conexión del pool debe buscar primero en el schema costeo_bc,
// porque varios procedures (sp_registrar_insumo, sp_eliminar_ingrediente, etc.)
// usan nombres de tabla sin calificar (ej. "INSERT INTO ingredientes" en vez de
// "INSERT INTO costeo_bc.ingredientes"), y dependen del search_path de la sesión.
pool.on('connect', (client) => {
  client.query('SET search_path TO costeo_bc, public');
});