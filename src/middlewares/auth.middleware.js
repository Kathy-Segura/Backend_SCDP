import { verificarToken } from '../utils/jwt.util.js';

export const verificarAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verificarToken(token);
    req.usuarios = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Token inválido o expirado' });
  }
};

export const permitirRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuarios.rol)) {
      return res.status(403).json({ status: 'error', message: 'No tienes permisos para esta acción' });
    }
    next();
  };
};