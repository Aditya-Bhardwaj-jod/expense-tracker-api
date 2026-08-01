import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Smart Expense Tracker API',
    version: '1.0.0',
    description: 'A REST API for tracking personal expenses.',
  },
  servers: [{ url: '/' }],
  components: {
    schemas: {
      ExpenseInput: {
        type: 'object',
        required: ['title', 'amount', 'category', 'date'],
        properties: {
          title: { type: 'string', example: 'Grocery shopping' },
          amount: { type: 'number', example: 1500 },
          category: { type: 'string', example: 'Food' },
          date: { type: 'string', format: 'date', example: '2026-07-15' },
        },
      },
      Expense: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          title: { type: 'string', example: 'Grocery shopping' },
          amount: { type: 'number', example: 1500 },
          category: { type: 'string', example: 'Food' },
          date: { type: 'string', example: '2026-07-15' },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
