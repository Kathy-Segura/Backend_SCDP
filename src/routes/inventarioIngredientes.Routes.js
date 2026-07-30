import { Router } from 'express';
import { verificarAuth } from '../middlewares/auth.middleware.js';
import {
  getResumen,
  getCategorias,
  getUnidadesMedida,
  getInventario,
  putActualizarIngrediente,
  deleteIngrediente,
  putReactivarIngrediente
} from '../controllers/inventarioIngredientes.controller.js';

const router = Router();

/**
 * @swagger
 * /api/ingredients-inventory/summary:
 *   get:
 *     tags:
 *       - Modulo de Inventario de Ingredientes
 *     summary: Cards del dashboard (total de ingredientes activos, valor de inventario, stock bajo)
 *     responses:
 *       200:
 *         description: Resumen del inventario
 */
router.get('/ingredients-inventory/summary', verificarAuth, getResumen);

/**
 * @swagger
 * /api/ingredients-inventory/categories:
 *   get:
 *     tags:
 *       - Modulo de Inventario de Ingredientes
 *     summary: Lista las categorías de ingrediente (filtro de tabla y form de edición)
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/ingredients-inventory/categories', verificarAuth, getCategorias);

/**
 * @swagger
 * /api/ingredients-inventory/units:
 *   get:
 *     tags:
 *       - Modulo de Inventario de Ingredientes
 *     summary: Lista las unidades de medida (form de edición, cambio de unidad base)
 *     responses:
 *       200:
 *         description: Lista de unidades de medida con su tipo_medida y factor_conversion_base
 */
router.get('/ingredients-inventory/units', verificarAuth, getUnidadesMedida);

/**
 * @swagger
 * /api/ingredients-inventory:
 *   get:
 *     tags:
 *       - Modulo de Inventario de Ingredientes
 *     summary: Tabla principal del inventario (soporta ?search= y ?categoria_id=)
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Filtra por nombre del ingrediente
 *       - in: query
 *         name: categoria_id
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Inventario valorizado
 */
router.get('/ingredients-inventory', verificarAuth, getInventario);

/**
 * @swagger
 * /api/ingredients-inventory/{id}:
 *   put:
 *     tags:
 *       - Modulo de Inventario de Ingredientes
 *     summary: >
 *       Botón "Editar": actualiza nombre, categoría, unidad base, costo y/o
 *       stock de un ingrediente existente en un solo llamado. Todos los
 *       campos son opcionales (no mandarlos = no cambiarlos). El valor
 *       total NO se edita acá porque es una columna calculada.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: { type: string }
 *               categoria_id: { type: integer }
 *               unidad_id: { type: integer }
 *               costo_unitario: { type: number }
 *               stock: { type: number }
 *               motivo_ajuste_stock: { type: string }
 *     responses:
 *       200:
 *         description: Ingrediente actualizado
 *       422:
 *         description: Ingrediente inexistente o cambio de unidad base no permitido
 */
router.put('/ingredients-inventory/:id', verificarAuth, putActualizarIngrediente);

/**
 * @swagger
 * /api/ingredients-inventory/{id}:
 *   delete:
 *     tags:
 *       - Modulo de Inventario de Ingredientes
 *     summary: Desactiva o elimina un ingrediente (baja lógica automática si está en uso, física si no)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Ingrediente eliminado o desactivado
 *       422:
 *         description: Ingrediente inexistente
 */
router.delete('/ingredients-inventory/:id', verificarAuth, deleteIngrediente);

/**
 * @swagger
 * /api/ingredients-inventory/{id}/reactivate:
 *   put:
 *     tags:
 *       - Modulo de Inventario de Ingredientes
 *     summary: Botón "Reactivar" (solo visible cuando estado = Descontinuado)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Ingrediente reactivado
 *       422:
 *         description: Ingrediente inexistente o ya estaba activo
 */
router.put('/ingredients-inventory/:id/reactivate', verificarAuth, putReactivarIngrediente);

export default router;
