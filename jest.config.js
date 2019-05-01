module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,js}', '!**/node_modules/**', '!**/lib/**'],
  coverageDirectory: './coverage',
};
