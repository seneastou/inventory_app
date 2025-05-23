/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // ✅ pour React et les composants avec DOM
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // ✅ support TypeScript + JSX
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'], // ⛔ ignore fichiers Next.js et node_modules
  moduleNameMapper: {
    // ✅ éviter les erreurs d'import CSS/SASS dans les composants React
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // ✅ pour jest-dom
};

