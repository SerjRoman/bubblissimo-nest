/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */

const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");
module.exports = {
  preset: "ts-jest",
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  clearMocks: true,
  collectCoverage: false,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  testPathIgnorePatterns: ["/factories/"],
};
