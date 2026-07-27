import { Router } from 'express';
import { verificarAuth } from '../middlewares/auth.middleware.js';
import {
  getCategorias,
  getRestaurantes,
  getIngredientesDisponibles,
  postCalcularCosto,
  postCrearPlatillo,
  getHistorialPlatillos
} from '../controllers/platillo.controller.js';

const router = Router();

/**
 * @swagger
 * /api/dishes/categories:
 *   get:
 *     tags:
 *       - Modulo de Crear Platillo (Formulario e Historial de Platillos)
 *     summary: Lista las categorías de platillo (para el dropdown del formulario)
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/dishes/categories', verificarAuth, getCategorias);

/**
 * @swagger
 * /api/dishes/restaurants:
 *   get:
 *     tags:
 *       - Modulo de Crear Platillo (Formulario e Historial de Platillos)
 *     summary: Lista los restaurantes activos (para el dropdown del formulario)
 *     responses:
 *       200:
 *         description: Lista de restaurantes
 */
router.get('/dishes/restaurants', verificarAuth, getRestaurantes);

/**
 * @swagger
 * /api/dishes/available-ingredients:
 *   get:
 *     tags:
 *       - Modulo de Crear Platillo (Formulario e Historial de Platillos)
 *     summary: Lista los ingredientes activos disponibles para armar la receta
 *     responses:
 *       200:
 *         description: Lista de ingredientes con su unidad base y costo vigente
 */
router.get('/dishes/available-ingredients', verificarAuth, getIngredientesDisponibles);

/**
 * @swagger
 * /api/dishes/calculate-cost:
 *   post:
 *     tags:
 *       - Modulo de Crear Platillo (Formulario e Historial de Platillos)
 *     summary: Calcula el costo total de la receta armada hasta el momento (preview, no guarda)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ingredientes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingrediente_id: { type: integer }
 *                     cantidad: { type: number }
 *                     unidad_id: { type: integer }
 *     responses:
 *       200:
 *         description: Costo total calculado
 *       400:
 *         description: Datos faltantes
 *       422:
 *         description: Ingrediente inexistente o sin conversión posible entre las unidades indicadas
 */
router.post('/dishes/calculate-cost', verificarAuth, postCalcularCosto);

/**
 * @swagger
 * /api/dishes:
 *   post:
 *     tags:
 *       - Modulo de Crear Platillo (Formulario e Historial de Platillos)
 *     summary: Registra un nuevo platillo junto con su receta, ya con el costo confirmado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurante_id: { type: integer }
 *               nombre_platillo: { type: string }
 *               categoria_id: { type: integer }
 *               precio_venta: { type: number }
 *               ingredientes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingrediente_id: { type: integer }
 *                     cantidad: { type: number }
 *                     unidad_id: { type: integer }
 *     responses:
 *       201:
 *         description: Platillo registrado
 *       400:
 *         description: Datos faltantes
 *       409:
 *         description: Ya existe un platillo con ese nombre en ese restaurante
 *       422:
 *         description: Ingrediente inexistente o sin conversión posible entre las unidades indicadas
 */
router.post('/dishes', verificarAuth, postCrearPlatillo);

/**
 * @swagger
 * /api/dishes/recent:
 *   get:
 *     tags:
 *       - Modulo de Crear Platillo (Formulario e Historial de Platillos)
 *     summary: Historial de los últimos 50 platillos registrados
 *     responses:
 *       200:
 *         description: Lista del historial
 */
router.get('/dishes/recent', verificarAuth, getHistorialPlatillos);

export default router;
