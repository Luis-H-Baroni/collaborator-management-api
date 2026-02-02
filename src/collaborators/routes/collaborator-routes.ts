import { Router } from 'express';
import {
  importCollaborators,
  listCollaborators,
  getCollaboratorById,
  deleteCollaborator,
} from '../controllers/collaborator-controller';

const router = Router();

/**
 * @swagger
 * /collaborators/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

/**
 * @swagger
 * /collaborators/import:
 *   post:
 *     summary: Import collaborators from external API
 *     tags: [Collaborators]
 *     responses:
 *       200:
 *         description: Collaborators imported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imported:
 *                   type: number
 *                 ignored:
 *                   type: number
 */
router.post('/import', importCollaborators);

/**
 * @swagger
 * /collaborators:
 *   get:
 *     summary: List all collaborators
 *     tags: [Collaborators]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: List of collaborators
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Collaborator'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/', listCollaborators);

/**
 * @swagger
 * /collaborators/{id}:
 *   get:
 *     summary: Get collaborator by ID
 *     tags: [Collaborators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Collaborator found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collaborator'
 *       404:
 *         description: Collaborator not found
 */
router.get('/:id', getCollaboratorById);

/**
 * @swagger
 * /collaborators/{id}:
 *   delete:
 *     summary: Delete collaborator by ID
 *     tags: [Collaborators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Collaborator deleted successfully
 *       404:
 *         description: Collaborator not found
 */
router.delete('/:id', deleteCollaborator);

/**
 * @swagger
 * components:
 *   schemas:
 *     Collaborator:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         city:
 *           type: string
 *         company:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

export default router;
