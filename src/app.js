import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import expenseRoutes from './routes/expense.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { swaggerSpec } from './config/swagger.js';

const app = express();

app.use(helmet());
app.use(compression());

// Keep test output clean; request logging isn't useful noise in a test run.
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Service is healthy', data: {} });
});

app.use('/expenses', expenseRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
