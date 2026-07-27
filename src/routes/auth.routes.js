import { Router } from 'express';
import { registrar, login } from '../controllers/auth.controller.js';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Modulo de Registro e Inicio de Sesion
 *     summary: Registra un nuevo usuario
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: { type: string }
 *               email: { type: string }
 *               password_hash: { type: string }
 *               rol: { type: string }
 *     responses:
 *       201:  
 *         description: Usuario creado
 *       409:
 *         description: Email ya registrado
 */
router.post('/auth/register', registrar);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Modulo de Registro e Inicio de Sesion
 *     summary: Inicia sesión y devuelve un token JWT
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password_hash: { type: string }
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/auth/login', login);

export default router;
