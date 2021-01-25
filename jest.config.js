module.exports = {
  verbose: true,
  testMatch: ['**/tests/**/*.spec.js'],
  collectCoverageFrom: ['**/src/**/*.js'],
  setupFiles: ['./tests/init.js'],
  setupFilesAfterEnv: ['./tests/after-env.js'],
  testEnvironmentOptions: { resources: 'usable' },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy'
  }
};
