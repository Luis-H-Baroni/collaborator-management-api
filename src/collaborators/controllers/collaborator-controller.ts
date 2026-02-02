import { Request, Response, NextFunction } from 'express';
import CollaboratorService from '../services/collaborator-service';

class CollaboratorController {
  private collaboratorService: CollaboratorService;

  constructor(collaboratorService?: CollaboratorService) {
    this.collaboratorService = collaboratorService || new CollaboratorService();
  }

  async importCollaborators(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.collaboratorService.importCollaborators();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listCollaborators(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.collaboratorService.listCollaborators(
        req.query
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCollaboratorById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.collaboratorService.getCollaboratorById(
        id as string
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteCollaborator(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await this.collaboratorService.deleteCollaborator(id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default CollaboratorController;
