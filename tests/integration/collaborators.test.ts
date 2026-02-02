import request from 'supertest';
import app from '../../src/app';
import Collaborator from '../../src/collaborators/models/collaborator';

jest.mock('../../src/collaborators/models/collaborator');

describe('Collaborators API Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /collaborators/health', () => {
    it('should return health check', async () => {
      const response = await request(app).get('/collaborators/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        message: 'API is running',
      });
    });
  });

  describe('GET /collaborators', () => {
    it('should return paginated list of collaborators', async () => {
      const mockCollaborators = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          city: 'NYC',
          company: 'Acme',
          createdAt: new Date(),
        },
      ];

      (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: mockCollaborators,
        count: 1,
      });

      const response = await request(app).get('/collaborators');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
    });

    it('should support pagination parameters', async () => {
      (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: [],
        count: 0,
      });

      const response = await request(app).get('/collaborators?page=2&limit=5');

      expect(response.status).toBe(200);
      expect(Collaborator.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 5,
          offset: 5,
        })
      );
    });

    it('should support search parameter', async () => {
      (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: [],
        count: 0,
      });

      const response = await request(app).get('/collaborators?search=John');

      expect(response.status).toBe(200);
      expect(Collaborator.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: expect.any(Object),
          }),
        })
      );
    });

    it('should support sort parameter', async () => {
      (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: [],
        count: 0,
      });

      const response = await request(app).get(
        '/collaborators?sort=name&order=asc'
      );

      expect(response.status).toBe(200);
      expect(Collaborator.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [['name', 'ASC']],
        })
      );
    });

    it('should return empty list when no collaborators exist', async () => {
      (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: [],
        count: 0,
      });

      const response = await request(app).get('/collaborators');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });
  });

  describe('POST /collaborators/import', () => {
    it('should import collaborators from external API', async () => {
      (Collaborator.findAll as jest.Mock).mockResolvedValue([]);
      (Collaborator.bulkCreate as jest.Mock).mockResolvedValue([] as any);

      const response = await request(app).post('/collaborators/import');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('imported');
      expect(response.body).toHaveProperty('ignored');
      expect(typeof response.body.imported).toBe('number');
      expect(typeof response.body.ignored).toBe('number');
    });

    it('should handle empty import result', async () => {
      (Collaborator.findAll as jest.Mock).mockResolvedValue([]);
      (Collaborator.bulkCreate as jest.Mock).mockResolvedValue([] as any);

      const response = await request(app).post('/collaborators/import');

      expect(response.status).toBe(200);
      expect(response.body.imported).toBeGreaterThanOrEqual(0);
      expect(response.body.ignored).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GET /collaborators/:id', () => {
    it('should return collaborator by id', async () => {
      const mockCollaborator = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'John Doe',
        email: 'john@example.com',
        city: 'NYC',
        company: 'Acme',
        createdAt: new Date('2026-02-01T23:26:02.758Z'),
      };

      (Collaborator.findByPk as jest.Mock).mockResolvedValue(mockCollaborator);

      const response = await request(app).get(
        '/collaborators/550e8400-e29b-41d4-a716-446655440000'
      );

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(mockCollaborator.id);
      expect(response.body.name).toBe(mockCollaborator.name);
      expect(response.body.email).toBe(mockCollaborator.email);
      expect(response.body.city).toBe(mockCollaborator.city);
      expect(response.body.company).toBe(mockCollaborator.company);
    });

    it('should return 404 for non-existent collaborator', async () => {
      (Collaborator.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get(
        '/collaborators/00000000-0000-0000-0000-000000000000'
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Collaborator not found');
    });

    it('should handle invalid UUID format', async () => {
      (Collaborator.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/collaborators/invalid-id');

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /collaborators/:id', () => {
    it('should delete collaborator', async () => {
      const mockCollaborator = {
        id: '550e8400-e29b-41d4-a716-4466554400000',
        name: 'John Doe',
        destroy: jest.fn().mockResolvedValue(undefined),
      };

      (Collaborator.findByPk as jest.Mock).mockResolvedValue(mockCollaborator);

      const response = await request(app).delete(
        '/collaborators/550e8400-e29b-41d4-a716-4466554400000'
      );

      expect(response.status).toBe(204);
      expect(mockCollaborator.destroy).toHaveBeenCalled();
    });

    it('should return 404 for non-existent collaborator', async () => {
      (Collaborator.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete(
        '/collaborators/00000000-0000-0000-0000-000000000000'
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Collaborator not found');
    });

    it('should return 204 with no content on successful delete', async () => {
      const mockCollaborator = {
        id: '550e8400-e29b-41d4-a716-4466554400000',
        destroy: jest.fn().mockResolvedValue(undefined),
      };

      (Collaborator.findByPk as jest.Mock).mockResolvedValue(mockCollaborator);

      const response = await request(app).delete(
        '/collaborators/550e8400-e29b-41d4-a716-4466554400000'
      );

      expect(response.status).toBe(204);
      expect(response.text).toBe('');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Not Found' });
    });
  });
});
