import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Collaborators API',
      version: '1.0.0',
      description: 'API REST para gerenciamento de colaboradores',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/collaborators/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;
