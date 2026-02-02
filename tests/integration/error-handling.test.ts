import request from 'supertest';
import app from '../../src/app';
import { sequelize } from '../../src/config/database';

describe('Error Handling Integration Tests', () => {
  afterAll(async () => {
    await sequelize.close();
  });
  describe('404 Not Found', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/non-existent');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Not Found' });
    });

    it('should return 404 for truly non-existent path', async () => {
      const response = await request(app).get('/completely/nonexistent/path');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Not Found' });
    });
  });

  describe('Invalid HTTP Methods', () => {
    it('should return 404 for POST on root', async () => {
      const response = await request(app).post('/');

      expect(response.status).toBe(404);
    });

    it('should return 404 for PUT on collaborators', async () => {
      const response = await request(app).put('/collaborators');

      expect(response.status).toBe(404);
    });
  });

  describe('Malformed Requests', () => {
    it('should handle invalid query parameters gracefully', async () => {
      const response = await request(app).get(
        '/collaborators?page=invalid&limit=invalid'
      );

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should handle invalid sort values', async () => {
      const response = await request(app).get(
        '/collaborators?sort=invalid&order=invalid'
      );

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});
