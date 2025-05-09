module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transformIgnorePatterns: [
    'node_modules/(?!axios)/'
  ],
  moduleNameMapper: {
    '^axios$': '<rootDir>/src/__mocks__/axios.js'
  }
};