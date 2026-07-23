/** @type {import('jest').Config} */
const config = {
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.js'],
    globalSetup: '<rootDir>/jest.global-setup.mjs',
    modulePathIgnorePatterns: ['<rootDir>/postgres-data'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],
}

export default config
