import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = '8h';

export const generarToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
};

export const verificarToken = (token) => {
  return jwt.verify(token, SECRET);
};