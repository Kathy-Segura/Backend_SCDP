import { pool } from '../config/db.js';

export const buscarUsuarioPorEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM costeo_bc.usuarios WHERE email = $1 AND activo = true',
    [email]
  );
  return result.rows[0] || null;
};

export const crearUsuario = async ({ nombre, email, passwordHash, rol }) => {
  const result = await pool.query(
    `INSERT INTO costeo_bc.usuarios (nombre, email, password_hash, rol)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nombre, email, rol, creado_en`,
    [nombre, email, passwordHash, rol]
  );
  return result.rows[0];
};