const baseConfig = require('./jest.config.unit');

module.exports = {
  ...baseConfig,
  testTimeout: 120_000,
  testMatch: [ 
    '**/__tests__/e2e/*.(js|ts|tsx)', 
    '**/__tests__/e2e/?(*.)+(spec|test).(js|ts|tsx)'
  ],
  setupFilesAfterEnv: ['./tests/utils/setup/init-e2e-tests.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!@calo|lodash-es|middy|calo-backend-types|aws-testing-library|filter-obj|axios)'
  ],
  modulePathIgnorePatterns: ['<rootDir>/services/package.json']
};