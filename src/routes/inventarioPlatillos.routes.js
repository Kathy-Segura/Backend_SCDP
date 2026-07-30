import { Router } from 'express';
import { verificarAuth } from '../middlewares/auth.middleware.js';
import {
  getResumen,
  getCategorias,
  getPlatillos,
  getDetalle,
  getIngredientesDisponibles,
  getUnidadesMedida,
  postAgregarIngrediente,
  deleteIngredienteDePlatillo,
  putActualizarPlatillo,
  deletePlatillo
} from '../controllers/inventarioPlatillos.controller.js';

const router = Router();

/**
 * @swagger
 * /api/dishes-inventory/summary:
 *   get:
 *     tags:
 *       - Modulo de Inventario de Platillos
 *     summary: Cards del encabezado (total de platillos, total de categorías de platillo)
 *     responses:
 *       200:
 *         description: Resumen del módulo
 */
router.get('/dishes-inventory/summary', verificarAuth, getResumen);

/**
 * @swagger
 * /api/dishes-inventory/categories:
 *   get:
 *     tags:
 *       - Modulo de Inventario de Platillos
 *     summary: Lista las categorías de platillo con al menos un platillo activo (combo de filtro)
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/dishes-inventory/categories', verificarAuth, getCategorias);

/**
 * @swagger
 * /api/dishes-inventory:
 *   get:
 *     tags:
 *       - Modulo de Inventario de Platillos
 *     summary: Tabla principal de platillos (soporta ?search= y ?categoria_id=)
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Filtra por nombre del platillo
 *       - in: query
 *         name: categoria_id
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Platillos con costo y margen
 */
router.get('/dishes-inventory', verificarAuth, getPlatillos);

/**
 * @swagger
 * /api/dishes-inventory/ingredient-options:
 *   get:
 *     tags:
 *       - Modulo de Inventario de Platillos
 *     summary: Ingredientes activos para el combo "agregar ingrediente" del modal Editar
 *     responses:
 *       200:
 *         description: Lista de ingredientes disponibles
 */
router.get('/dishes-inventory/ingredient-options', verificarAuth, getIngredientesDisponibles);

/**
 * @swagger
 * /api/dishes-inventory/units:
 *   get:
 *     tags:
 *       - Modulo de Inventario de Platillos
 *     summary: Catálogo de unidades de medida para el modal Editar
 *     responses:
 *       200:
 *         description: Lista de unidades de medida
 */
router.get('/dishes-inventory/units', verificarAuth, getUnidadesMedida);

/**
 * @swagger
 * /api/dishes-inventory/{id}:
 *   get:
 *     tags:
 *       - Modulo de Inventario de Platillos
 *     summary: Botón "Ver" - encabezado del platillo y tabla de ingredientes de la receta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Detalle del platillo
 *       404:
 *         description: El platillo no existe
 */
router.get('/dishes-inventory/:id', verificarAuth, getDetalle);

/**
 * @swagger
 * /api/dishes-inventory/{id}/ingredients:
 *   post:
 *     tags:
 *       - Modulo de Inventario de Platillos
 *     summary: Botón "Agregar ingrediente" del modal Editar (se guarda de inmediato)
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
 *               ingrediente_id: { type: integer }
 *               cantidad: { type: number }
 *               unidad_id: { type: integer }
 *     responses:
 *       200:
 *         description: Ingrediente agregado, regresa la mini tabla y las 3 cards actualizadas
 *       400:
 *         description: Datos faltantes o inválidos
 *       422:
 *         description: Ingrediente inexistente o descontinuado
 */
router.post('/dishes-inventory/:id/ingredients', verificarAuth, postAgregarIngrediente);

/**
 * @swagger
 * /api/dishes-inventory/{id}/ingredients/{ingredienteId}:
 *   delete:
 *     tags:
 *       - Modulo de Inventario de Platillos
 *     summary: Quita una línea de la receta (complemento, opcional en el front)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: ingredienteId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Ingrediente quitado, regresa la mini tabla y las 3 cards actualizadas
 *       422:
 *         description: Ese ingrediente no está en la receta de este platillo
 */
router.delete('/dishes-inventory/:id/ingredients/:ingredienteId', verificarAuth, deleteIngredienteDePlatillo);

/**
 * @swagger
 * /api/dishes-inventory/{id}:
 *   put:
 *     tags:
 *       - Modulo de Inventario de Platillos
 *     summary: Botón "Guardar cambios" del modal Editar (nombre, categoría y/o precio de venta)
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
 *               nombre_platillo: { type: string }
 *               categoria_id: { type: integer }
 *               precio_venta: { type: number }
 *     responses:
 *       200:
 *         description: Platillo actualizado
 *       422:
 *         description: El platillo no existe o el nombre ya está en uso en ese restaurante
 */
router.put('/dishes-inventory/:id', verificarAuth, putActualizarPlatillo);

/**
 * @swagger
 * /api/dishes-inventory/{id}:
 *   delete:
 *     tags:
 *       - Modulo de Inventario de Platillos
 *     summary: Botón "Eliminar" (baja lógica, activo=false)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Platillo desactivado
 */
router.delete('/dishes-inventory/:id', verificarAuth, deletePlatillo);

export default router;
