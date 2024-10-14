import swaggerJsdoc from 'swagger-jsdoc'
import { env } from './src/config.js'
const PORT = env.port

// Configuration de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Vous pouvez aussi utiliser '2.0' pour Swagger 2.0
    info: {
      title: 'API Documentation',
      version: '1.1.0',
      description: 'Documentation de l\'API',
      contact: {
        name: 'Votre Nom',
        url: 'http://votre-site-web.com',
        email: 'votre-email@exemple.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`, // L'URL de votre API
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie', // Authentification par cookie
          name: 'access_token', // Nom du cookie contenant le token
        },
      },
    },
    security: [
      {
        cookieAuth: [], // Applique la sécurité par cookie à toutes les routes
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Chemin des fichiers où Swagger scannera les annotations
};

// Initialisation de SwaggerJSDoc
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

export default swaggerSpecs;
