module.exports = {
  verbose: true,
  testMatch: ['**/tests/**/*.spec.js'],
  collectCoverageFrom: ['**/src/**/*.js'],
  setupFiles: ['./tests/init.js'],
  coverageThreshold: {
    global: {
      branches: 77.69,
      functions: 70.2,
      lines: 81.89,
      statements: 82.15
    }
  }
};
