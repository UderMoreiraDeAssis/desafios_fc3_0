import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  transformIgnorePatterns: ["/node_modules/(?!jstoxml)"],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest", {}],
  },
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/*.spec.ts"],
};

export default config;
