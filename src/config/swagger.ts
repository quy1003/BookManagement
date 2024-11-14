const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Cấu hình cho Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for our project',
    },
    servers: [
      {
        url: 'http://localhost:3000', // URL của server
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Chỉ đến nơi chứa các route
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
module.exports = { swaggerUi, swaggerDocs };
