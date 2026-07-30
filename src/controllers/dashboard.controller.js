import {
  obtenerResumenCards,
  obtenerStockPorIngrediente,
  obtenerDistribucionPorCategoria,
  obtenerCostoUnitario,
  obtenerMargenPorPlatillo
} from '../models/dashboard.model.js';

const LIMITE_DEFAULT = 15;

// Helper: ?limit= opcional, mismo tope por defecto para los 3 gráficos
// que se pueden llenar de barras si hay muchos ingredientes/platillos.
const resolverLimite = (limitQueryParam) => {
  const limite = Number(limitQueryParam);
  return Number.isInteger(limite) && limite > 0 ? limite : LIMITE_DEFAULT;
};

// Las 4 cards del encabezado
export const getResumen = async (req, res, next) => {
  try {
    const data = await obtenerResumenCards();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

// Gráfico de barra: "Stock por ingrediente" (soporta ?limit=)
export const getStockPorIngrediente = async (req, res, next) => {
  try {
    const data = await obtenerStockPorIngrediente(resolverLimite(req.query.limit));
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

// Gráfico de anillo: "Distribución por categoría"
export const getDistribucionPorCategoria = async (req, res, next) => {
  try {
    const data = await obtenerDistribucionPorCategoria();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

// Gráfico de barra horizontal: "Costo unitario" (soporta ?limit=)
export const getCostoUnitario = async (req, res, next) => {
  try {
    const data = await obtenerCostoUnitario(resolverLimite(req.query.limit));
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

// Gráfico de barras dobles: "Margen por platillo" (soporta ?limit=)
export const getMargenPorPlatillo = async (req, res, next) => {
  try {
    const data = await obtenerMargenPorPlatillo(resolverLimite(req.query.limit));
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};
