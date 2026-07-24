import bcrypt from 'bcrypt';
import { buscarUsuarioPorEmail, crearUsuario } from '../models/usuario.model.js';
import { generarToken } from '../utils/jwt.util.js';

const SALT_ROUNDS = 10;

export const registrar = async (req, res, next) => {
  try {
    const { nombre, email, rol } = req.body;
    // Acepta "password" o "password_hash" como nombre del campo en el body
    const password = req.body.password || req.body.password_hash;

    if (!nombre || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'nombre, email y password son requeridos' });
    }

    const existente = await buscarUsuarioPorEmail(email);
    if (existente) {
      return res.status(409).json({ status: 'error', message: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const nuevoUsuario = await crearUsuario({ nombre, email, passwordHash, rol });

    res.status(201).json({ status: 'ok', data: nuevoUsuario });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Acepta "password" o "password_hash" como nombre del campo en el body
    const password = req.body.password || req.body.password_hash;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'email y password son requeridos' });
    }

    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
    }

    const token = generarToken({ id: usuario.id, email: usuario.email, rol: usuario.rol });

    res.json({
      status: 'ok',
      data: {
        token,
        usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
      }
    });
  } catch (error) {
    next(error);
  }
};