import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistema del centro de producción (CDP)',
      version: '1.0.0',
      description: 'API REST para gestión de costos e inventario del Centro de Producción (CDP)'
    },
    servers: [
      { url: 'http://localhost:4000', description: 'Servidor local' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ]
  },
  apis: ['./src/routes/*.js'] // lee las anotaciones @swagger de todas las rutas
};

export const swaggerSpec = swaggerJsdoc(options);