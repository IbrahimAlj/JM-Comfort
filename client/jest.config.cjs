/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  // Only look for tests in src/ — avoids picking up the legacy nested client/client/ directory
  roots: ['<rootDir>/src'],
  // Polyfill TextEncoder/TextDecoder required by React Router v7 in the jsdom environment
  setupFiles: ['<rootDir>/jest.polyfills.cjs'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  // react-icons v5 ships ESM; allow babel-jest to transform it
  transformIgnorePatterns: [
    '/node_modules/(?!(react-icons)/)',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.cjs',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.cjs',
  },
};
