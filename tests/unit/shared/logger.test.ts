import logger from '../../../src/shared/utils/logger';

describe('logger', () => {
  it('should have info method', () => {
    expect(typeof logger.info).toBe('function');
  });

  it('should have error method', () => {
    expect(typeof logger.error).toBe('function');
  });

  it('should have warn method', () => {
    expect(typeof logger.warn).toBe('function');
  });

  it('should have debug method', () => {
    expect(typeof logger.debug).toBe('function');
  });

  it('should log info without throwing', () => {
    expect(() => logger.info('Test message')).not.toThrow();
  });

  it('should log error without throwing', () => {
    expect(() => logger.error('Error message')).not.toThrow();
  });

  it('should log error with error object without throwing', () => {
    const error = new Error('Test error');
    expect(() => logger.error('Error message', error)).not.toThrow();
  });

  it('should log warn without throwing', () => {
    expect(() => logger.warn('Warning message')).not.toThrow();
  });

  it('should log debug without throwing', () => {
    process.env.NODE_ENV = 'development';
    expect(() => logger.debug('Debug message')).not.toThrow();
  });
});
