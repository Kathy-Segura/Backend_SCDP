import { Router } from 'express';
import { verificarAuth } from '../middlewares/auth.middleware.js';
import {
  getResumen,
  getStockPorIngrediente,
  getDistribucionPorCategoria,
  getCostoUnitario,
  getMargenPorPlatillo
} from '../controllers/dashboard.controller.js';

const router = Router();

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     tags:
 *       - Modulo de Dashboard
 *     summary: Las 4 cards del dashboard (ingredientes, valor de inventario, platillos, stock bajo)
 *     responses:
 *       200:
 *         description: Resumen general
 */
router.get('/dashboard/summary', verificarAuth, getResumen);

/**
 * @swagger
 * /api/dashboard/charts/stock-by-ingredient:
 *   get:
 *     tags:
 *       - Modulo de Dashboard
 *     summary: Gráfico de barra - stock actual por ingrediente
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 15 }
 *         description: Cuántos ingredientes mostrar (los de mayor stock primero)
 *     responses:
 *       200:
 *         description: Serie para el gráfico de barra
 */
router.get('/dashboard/charts/stock-by-ingredient', verificarAuth, getStockPorIngrediente);

/**
 * @swagger
 * /api/dashboard/charts/category-distribution:
 *   get:
 *     tags:
 *       - Modulo de Dashboard
 *     summary: Gráfico de anillo - distribución del valor de inventario por categoría de ingrediente
 *     responses:
 *       200:
 *         description: Serie para el gráfico de anillo
 */
router.get('/dashboard/charts/category-distribution', verificarAuth, getDistribucionPorCategoria);

/**
 * @swagger
 * /api/dashboard/charts/unit-cost:
 *   get:
 *     tags:
 *       - Modulo de Dashboard
 *     summary: Gráfico de barra horizontal - costo unitario por ingrediente
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 15 }
 *         description: Cuántos ingredientes mostrar (los de mayor costo primero)
 *     responses:
 *       200:
 *         description: Serie para el gráfico de barra horizontal
 */
router.get('/dashboard/charts/unit-cost', verificarAuth, getCostoUnitario);

/**
 * @swagger
 * /api/dashboard/charts/margin-by-dish:
 *   get:
 *     tags:
 *       - Modulo de Dashboard
 *     summary: Gráfico de barras dobles - costo de ingredientes vs precio de venta por platillo
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 15 }
 *         description: Cuántos platillos mostrar (los de mayor margen bruto primero)
 *     responses:
 *       200:
 *         description: Serie para el gráfico de barras dobles
 */
router.get('/dashboard/charts/margin-by-dish', verificarAuth, getMargenPorPlatillo);

export default router;
