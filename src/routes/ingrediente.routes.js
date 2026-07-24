import { Router } from 'express';
import { verificarAuth } from '../middlewares/auth.middleware.js';
import {
  getCategorias,
  getUnidades,
  postCalcularCosto,
  postRegistrarInsumo,
  getHistorialInsumos
} from '../controllers/ingrediente.controller.js';

const router = Router();

/**
 * @swagger
 * /api/ingredients/categories:
 *   get:
 *     summary: Lista las categorías de ingredientes (para el dropdown del formulario)
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/ingredients/categories', verificarAuth, getCategorias);

/**
 * @swagger
 * /api/ingredients/units:
 *   get:
 *     summary: Lista las unidades de medida (para el dropdown del formulario)
 *     responses:
 *       200:
 *         description: Lista de unidades
 */
router.get('/ingredients/units', verificarAuth, getUnidades);

/**
 * @swagger
 * /api/ingredients/calculate-cost:
 *   post:
 *     summary: Calcula el costo unitario a partir de los datos de compra (preview, no guarda)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               costo_total_compra: { type: number }
 *               cantidad_comprada: { type: number }
 *               unidad_compra_id: { type: integer }
 *               cantidad_uso: { type: number }
 *               unidad_uso_id: { type: integer }
 *     responses:
 *       200:
 *         description: Costo unitario calculado
 *       400:
 *         description: Datos faltantes
 *       422:
 *         description: No hay conversión posible entre las unidades indicadas
 */
router.post('/ingredients/calculate-cost', verificarAuth, postCalcularCosto);

/**
 * @swagger
 * /api/ingredients:
 *   post:
 *     summary: Registra un nuevo ingrediente (insumo) ya con el costo confirmado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_ingrediente: { type: string }
 *               categoria_id: { type: integer }
 *               unidad_id: { type: integer }
 *               costo_unitario: { type: number }
 *               stock_inicial: { type: number }
 *               stock_minimo: { type: number }
 *     responses:
 *       201:
 *         description: Ingrediente registrado
 *       400:
 *         description: Datos faltantes
 */
router.post('/ingredients', verificarAuth, postRegistrarInsumo);

/**
 * @swagger
 * /api/ingredients/recent:
 *   get:
 *     summary: Historial de los últimos 50 ingredientes registrados
 *     responses:
 *       200:
 *         description: Lista del historial
 */
router.get('/ingredients/recent', verificarAuth, getHistorialInsumos);

export default router;