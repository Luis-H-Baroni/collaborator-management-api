import { sequelize, testConnection } from '../../../src/config/database';

describe('database config', () => {
  it('should export testConnection', () => {
    expect(testConnection).toBeDefined();
    expect(typeof testConnection).toBe('function');
  });

  it('should export sequelize', () => {
    expect(sequelize).toBeDefined();
    expect(typeof sequelize.authenticate).toBe('function');
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
