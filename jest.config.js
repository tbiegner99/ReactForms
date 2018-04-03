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
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy'
  }
};
