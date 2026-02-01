import express from 'express';
import collaboratorRoutes from './collaborators/routes/collaborator-routes';
import { errorHandler, notFoundHandler } from './shared/middleware/error-handler';

const app = express();

app.use(express.json());

app.use('/collaborators', collaboratorRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
