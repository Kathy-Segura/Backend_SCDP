import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { pool } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { swaggerSpec } from './docs/swagger.js';
import ingredienteRoutes from './routes/ingrediente.routes.js';
import platilloRoutes from './routes/platillo.routes.js';

dotenv.config();

/**
 * SUSTITUIR LOS MODELOS MANUALES POR LOS PROCEDIMIENTOS ALMACENADOS 
 */

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Documentación interactiva
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', dbTime: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.use('/api', authRoutes);
app.use('/api', ingredienteRoutes);
app.use('/api', platilloRoutes);
//app.use('/api', TablaIngredientes);
//app.use('/api', TablaPlatillos);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación Swagger en http://localhost:${PORT}/api-docs`);
});