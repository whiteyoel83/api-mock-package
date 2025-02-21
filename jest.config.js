module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  verbose: true,
  coverageDirectory: "coverage",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"], // Include only TypeScript files in src/
  coverageThreshold: {
    global: {
      branches: 90, // Aim for 90% branch coverage
      functions: 90, // Aim for 90% function coverage
      lines: 90, // Aim for 90% line coverage
      statements: 90, // Aim for 90% statement coverage
    },
  },
};
