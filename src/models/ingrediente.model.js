import { pool } from '../config/db.js';

// Dropdowns del formulario
export const listarCategoriasIngrediente = async () => {
  const result = await pool.query(
    `SELECT id, nombre_categoria FROM costeo_bc.categorias_ingrediente ORDER BY nombre_categoria`
  );
  return result.rows;
};

export const listarUnidadesMedida = async () => {
  const result = await pool.query(
    `SELECT id, codigo_unidad, nombre_unidad, tipo_medida FROM costeo_bc.unidades_medida ORDER BY nombre_unidad`
  );
  return result.rows;
};

// Paso 1: cálculo del costo unitario (preview, NO guarda nada en la BD)
export const calcularCostoUnitario = async ({ costoTotalCompra, cantidadComprada, unidadCompraId, cantidadUso, unidadUsoId }) => {
  const result = await pool.query(
    `SELECT costeo_bc.fn_calcular_costo_porcion($1, $2, $3, $4, $5) AS costo_unitario`,
    [costoTotalCompra, cantidadComprada, unidadCompraId, cantidadUso, unidadUsoId]
  );
  return result.rows[0];
};

// Paso 2: guarda el ingrediente ya con el costo calculado y confirmado
export const registrarInsumo = async ({ nombreIngrediente, categoriaId, unidadId, costoUnitario, stockInicial, stockMinimo }) => {
  await pool.query(
    `CALL costeo_bc.sp_registrar_insumo($1, $2, $3, $4, $5, $6)`,
    [nombreIngrediente, categoriaId, unidadId, costoUnitario, stockInicial ?? 0, stockMinimo ?? 0]
  );
};

// Historial (vista de los últimos 50)
export const historialInsumosRecientes = async () => {
  const result = await pool.query(
    `SELECT id, nombre, costo_unitario, stock_actual, created_at
     FROM costeo_bc.vw_historial_insumos_recientes`
  );
  return result.rows;
};