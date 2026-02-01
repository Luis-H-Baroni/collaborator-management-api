import { Router } from 'express';
import {
  importCollaborators,
  listCollaborators,
  getCollaboratorById,
  deleteCollaborator,
} from '../controllers/collaborator-controller';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

router.post('/import', importCollaborators);

router.get('/', listCollaborators);

router.get('/:id', getCollaboratorById);

router.delete('/:id', deleteCollaborator);

export default router;
