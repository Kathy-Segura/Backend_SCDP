import { pool } from '../config/db.js';

const SCHEMA = 'costeo_bc';

// --- Las 4 cards: Ingredientes, Valor inventario, Platillos, Stock bajo ---
export const obtenerResumenCards = async () => {
  const { rows: [resumen] } = await pool.query(
    `SELECT total_ingredientes, valor_inventario_total, total_platillos
       FROM ${SCHEMA}.vw_dashboard_resumen`
  );

  const { rows: [stock] } = await pool.query(
    `SELECT COUNT(*)::int AS stock_bajo
       FROM ${SCHEMA}.vw_inventario_valorizado
      WHERE bajo_stock_minimo`
  );

  return {
    total_ingredientes: resumen?.total_ingredientes ?? 0,
    valor_inventario_total: resumen?.valor_inventario_total ?? 0,
    total_platillos: resumen?.total_platillos ?? 0,
    stock_bajo: stock?.stock_bajo ?? 0
  };
};

// --- Gráfico de barra: "Stock por ingrediente" ---
export const obtenerStockPorIngrediente = async (limite) => {
  const { rows } = await pool.query(
    `SELECT nombre, stock_actual, unidad_medida
       FROM ${SCHEMA}.vw_inventario_valorizado
      ORDER BY stock_actual DESC
      LIMIT $1`,
    [limite]
  );
  return rows;
};

// --- Gráfico de anillo: "Distribución por categoría" ---
export const obtenerDistribucionPorCategoria = async () => {
  const { rows } = await pool.query(
    `SELECT categoria, cantidad_ingredientes, valor_inventario, porcentaje_del_valor
       FROM ${SCHEMA}.vw_dashboard_distribucion_categoria`
  );
  return rows;
};

// --- Gráfico de barra horizontal: "Costo unitario" ---
export const obtenerCostoUnitario = async (limite) => {
  const { rows } = await pool.query(
    `SELECT nombre, costo_unitario, unidad_medida
       FROM ${SCHEMA}.vw_inventario_valorizado
      ORDER BY costo_unitario DESC
      LIMIT $1`,
    [limite]
  );
  return rows;
};

// --- Gráfico de barras dobles: "Margen por platillo"
//     (costo de ingredientes vs precio de venta; la brecha entre las
//     dos barras es el margen) ---
export const obtenerMargenPorPlatillo = async (limite) => {
  const { rows } = await pool.query(
    `SELECT platillo, costo, precio_venta, margen_bruto, margen_porcentaje_venta
       FROM ${SCHEMA}.vw_margen_platillos
      ORDER BY margen_bruto DESC
      LIMIT $1`,
    [limite]
  );
  return rows;
};
