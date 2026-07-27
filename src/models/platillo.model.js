import { pool } from '../config/db.js';

// Dropdowns del formulario
export const listarCategoriasPlatillo = async () => {
  const result = await pool.query(
    `SELECT id, nombre_categoria FROM costeo_bc.categorias_platillo ORDER BY nombre_categoria`
  );
  return result.rows;
};

export const listarRestaurantes = async () => {
  const result = await pool.query(
    `SELECT id, nombre_restaurante FROM costeo_bc.restaurantes WHERE activo ORDER BY nombre_restaurante`
  );
  return result.rows;
};

// Lista de ingredientes activos para armar las líneas de la receta
// (selector de ingrediente + cantidad + unidad, a la par del formulario)
export const listarIngredientesActivos = async () => {
  const result = await pool.query(
    `SELECT id, nombre_ingrediente, unidad_medida_id, costo_unitario_actual
     FROM costeo_bc.ingredientes
     WHERE activo
     ORDER BY nombre_ingrediente`
  );
  return result.rows;
};

// Paso 1: cálculo del costo total de la receta (preview, NO guarda nada)
export const calcularCostoPlatillo = async ({ ingredientes }) => {
  const result = await pool.query(
    `SELECT costeo_bc.fn_calcular_costo_receta_preview($1::jsonb) AS costo_total`,
    [JSON.stringify(ingredientes)]
  );
  return result.rows[0];
};

// Paso 2: guarda el platillo y su receta completa, ya con el costo confirmado
export const crearPlatillo = async ({ restauranteId, nombrePlatillo, categoriaId, precioVenta, ingredientes }) => {
  await pool.query(
    `CALL costeo_bc.sp_crear_platillo($1, $2, $3, $4, $5::jsonb)`,
    [restauranteId, nombrePlatillo, categoriaId, precioVenta, JSON.stringify(ingredientes)]
  );
};

// Historial (vista de los últimos 50)
export const historialPlatillosRecientes = async () => {
  const result = await pool.query(
    `SELECT id, nombre, restaurante_id, precio_venta, costo_total_ingredientes, created_at
     FROM costeo_bc.vw_historial_platillos_recientes`
  );
  return result.rows;
};
