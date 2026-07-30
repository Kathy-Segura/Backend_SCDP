import { pool } from '../config/db.js';

const SCHEMA = 'costeo_bc';

// --- Cards: total de platillos activos, total de categorías de platillo ---
export const obtenerResumenCards = async () => {
  const { rows: [resumen] } = await pool.query(
    `SELECT total_platillos, total_categorias_platillo
       FROM ${SCHEMA}.vw_cards_platillos`
  );

  return {
    total_platillos: resumen?.total_platillos ?? 0,
    total_categorias_platillo: resumen?.total_categorias_platillo ?? 0
  };
};

// --- Combo de categorías (solo las que ya tienen algún platillo activo,
//     así el combo nunca muestra una categoría vacía) ---
export const listarCategorias = async () => {
  const { rows } = await pool.query(
    `SELECT categoria_id, categoria
       FROM ${SCHEMA}.fn_categorias_por_restaurante(NULL)`
  );
  return rows;
};

// --- Tabla principal (búsqueda automática + filtro por categoría) ---
export const listarPlatillos = async ({ search, categoriaId }) => {
  const { rows } = await pool.query(
    `SELECT platillo_id, platillo, categoria, costo, precio_venta, margen_bruto,
            ROUND(margen_sobre_costo * 100, 2) AS pct_margen_costo
       FROM ${SCHEMA}.fn_filtrar_platillos(NULL, $1, $2)`,
    [categoriaId || null, search || null]
  );
  return rows;
};

// --- Botón "Ver": encabezado del modal + tabla de ingredientes ---
export const obtenerDetallePlatillo = async (id) => {
  const { rows: [encabezado] } = await pool.query(
    `SELECT * FROM ${SCHEMA}.fn_detalle_platillo($1)`,
    [id]
  );

  const { rows: receta } = await pool.query(
    `SELECT * FROM ${SCHEMA}.fn_receta_detalle_platillo($1)`,
    [id]
  );

  return { encabezado: encabezado || null, receta };
};

// --- Combo "agregar ingrediente" del modal Editar (solo activos: uno
//     descontinuado no se puede meter a una receta nueva) ---
export const listarIngredientesDisponibles = async () => {
  const { rows } = await pool.query(
    `SELECT id, nombre, unidad_id, unidad, costo_unitario
       FROM ${SCHEMA}.vw_tabla_ingredientes
      WHERE activo
      ORDER BY nombre`
  );
  return rows;
};

// --- Combo "unidad de medida" del modal Editar ---
export const listarUnidadesMedida = async () => {
  const { rows } = await pool.query(
    `SELECT id, codigo_unidad, nombre_unidad, tipo_medida
       FROM ${SCHEMA}.unidades_medida
      ORDER BY tipo_medida, nombre_unidad`
  );
  return rows;
};

// --- Botón "Agregar ingrediente" -> sp_actualizar_ingrediente_platillo
//     (se guarda al vuelo, no espera al botón "Guardar cambios") ---
export const agregarIngredienteAPlatillo = async ({ platilloId, ingredienteId, cantidad, unidadId }) => {
  await pool.query(
    `CALL ${SCHEMA}.sp_actualizar_ingrediente_platillo($1, $2, $3, $4)`,
    [platilloId, ingredienteId, cantidad, unidadId || null]
  );
};

// --- Quitar una línea de la receta -> sp_eliminar_ingrediente_platillo
//     (complemento: no estaba en la lista original) ---
export const quitarIngredienteDePlatillo = async ({ platilloId, ingredienteId }) => {
  await pool.query(
    `CALL ${SCHEMA}.sp_eliminar_ingrediente_platillo($1, $2)`,
    [platilloId, ingredienteId]
  );
};

// --- Mini tabla + 3 cards del modal Editar (se recalcula solo, se
//     vuelve a pedir después de agregar/quitar un ingrediente) ---
export const obtenerResumenEdicion = async (id) => {
  const { rows: receta } = await pool.query(
    `SELECT ingrediente_id, ingrediente, cantidad_receta, unidad_receta, costo_subtotal
       FROM ${SCHEMA}.vw_costeo_platillos
      WHERE platillo_id = $1
      ORDER BY ingrediente`,
    [id]
  );

  const { rows: [margen] } = await pool.query(
    `SELECT costo, precio_venta, margen_porcentaje_venta
       FROM ${SCHEMA}.vw_margen_platillos
      WHERE platillo_id = $1`,
    [id]
  );

  return { receta, resumen: margen || null };
};

// --- Botón "Guardar cambios": nombre, categoría y/o precio de venta.
//     No toca la receta, eso lo hace agregarIngredienteAPlatillo. ---
export const actualizarPlatillo = async ({ id, nombre, categoriaId, precioVenta }) => {
  await pool.query(
    `CALL ${SCHEMA}.sp_actualizar_platillo($1, $2, $3, $4)`,
    [id, nombre || null, categoriaId || null, precioVenta || null]
  );
};

// --- Botón "Eliminar" (baja lógica, siempre activo=false) ---
export const eliminarPlatillo = async (id) => {
  await pool.query(`CALL ${SCHEMA}.sp_eliminar_platillo($1)`, [id]);
};
