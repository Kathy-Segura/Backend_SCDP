import { pool } from '../config/db.js';

const SCHEMA = 'costeo_bc';

// --- Cards: total ingredientes activos, valor de inventario, stock bajo ---
// Fuente: vw_cards_ingredientes (reemplaza a vw_dashboard_resumen +
// vw_inventario_valorizado, que ya no existen en el backup nuevo).
export const obtenerResumenCards = async () => {
  const { rows: [resumen] } = await pool.query(
    `SELECT total_ingredientes_activos, total_bajo_stock, valor_inventario_total
       FROM ${SCHEMA}.vw_cards_ingredientes`
  );

  return {
    total_ingredientes: resumen?.total_ingredientes_activos ?? 0,
    valor_inventario_total: resumen?.valor_inventario_total ?? 0,
    stock_bajo: resumen?.total_bajo_stock ?? 0
  };
};

// --- Combo de categorías (filtro de la tabla + form de edición) ---
export const listarCategorias = async () => {
  const { rows } = await pool.query(
    `SELECT id, nombre_categoria
       FROM ${SCHEMA}.categorias_ingrediente
      ORDER BY nombre_categoria`
  );
  return rows;
};

// --- Combo de unidades de medida (form de edición: cambio de unidad base) ---
// Se manda tipo_medida y factor_conversion_base para que el front pueda
// filtrar en el combo solo las unidades compatibles con la actual del
// ingrediente (mismo grupo físico: peso<->peso, volumen<->volumen). Las de
// tipo 'conteo' nunca son intercambiables entre sí (sp_actualizar_ingrediente
// las rechaza igual, esto es solo para no mostrar opciones que van a fallar).
export const listarUnidadesMedida = async () => {
  const { rows } = await pool.query(
    `SELECT id, codigo_unidad, nombre_unidad, tipo_medida, factor_conversion_base
       FROM ${SCHEMA}.unidades_medida
      ORDER BY tipo_medida, nombre_unidad`
  );
  return rows;
};

// --- Tabla principal (búsqueda + filtro por categoría) ---
// Fuente: vw_tabla_ingredientes (reemplaza a fn_reporte_inventario_ingredientes()).
// valor_total y bajo_stock_minimo ya no vienen calculados en la vista, se
// calculan acá porque la vista nueva no los trae.
export const listarInventario = async ({ search, categoriaId }) => {
  const { rows } = await pool.query(
    `SELECT v.id,
            v.nombre,
            v.unidad,
            v.unidad_id,
            v.categoria,
            v.categoria_id,
            v.costo_unitario,
            v.stock_actual,
            v.stock_minimo,
            (v.costo_unitario * COALESCE(v.stock_actual, 0))          AS valor_total,
            (v.stock_actual <= v.stock_minimo)                        AS bajo_stock_minimo,
            v.activo,
            v.updated_at
       FROM ${SCHEMA}.vw_tabla_ingredientes v
      WHERE ($1::text IS NULL OR v.nombre ILIKE '%' || $1 || '%')
        AND ($2::smallint IS NULL OR v.categoria_id = $2)
      ORDER BY v.categoria, v.nombre`,
    [search || null, categoriaId || null]
  );
  return rows;
};

// --- Botón "Editar" -> sp_actualizar_ingrediente ---
// Único punto de entrada para editar nombre, categoría, unidad base, costo
// y/o stock. Todos los campos son opcionales salvo el id: lo que se manda
// en null no se toca. Reemplaza a actualizarCostoIngrediente/
// actualizarStockMinimo/ajustarStock, que llamaban a 3 procedures que ya no
// existen en el backup nuevo.
export const actualizarIngrediente = async ({
  id,
  nombre,
  categoriaId,
  unidadId,
  costoUnitario,
  nuevoStock,
  motivoAjusteStock
}) => {
  await pool.query(
    `CALL ${SCHEMA}.sp_actualizar_ingrediente($1, $2, $3, $4, $5, $6, COALESCE($7, 'Ajuste manual desde módulo Ingredientes'))`,
    [id, nombre ?? null, categoriaId ?? null, unidadId ?? null, costoUnitario ?? null, nuevoStock ?? null, motivoAjusteStock ?? null]
  );
};

// --- Botón "Desactivar" (baja lógica si está en uso en algún platillo,
// baja física si nunca se usó). Procedure preexistente, no viene en este
// script incremental, se asume ya está en la base. ---
export const eliminarIngrediente = async (id) => {
  await pool.query(`CALL ${SCHEMA}.sp_eliminar_ingrediente($1)`, [id]);
};

// --- Botón "Reactivar" -> sp_reactivar_ingrediente ---
// Solo aplica a ingredientes con activo = false. Vuelve a habilitarlo para
// que pueda usarse en recetas nuevas; no toca costo ni stock.
export const reactivarIngrediente = async (id) => {
  await pool.query(`CALL ${SCHEMA}.sp_reactivar_ingrediente($1)`, [id]);
};
