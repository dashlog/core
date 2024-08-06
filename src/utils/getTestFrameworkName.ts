// Import Third-party Dependencies
import type { PackageJSON } from "@nodesecure/npm-types";

// CONSTANTS
const kNodeTestRunnerRegex = /(?:node\s+--test|tsx)/;

export function getTestFrameworkName(packageJson: PackageJSON): string {
  const { devDependencies: deps = {}, scripts = {} } = packageJson;

  if (kNodeTestRunnerRegex.test(scripts.test)) {
    return "node:test";
  }
  if ("ava" in deps) {
    return "ava";
  }
  if ("jest" in deps) {
    return "jest";
  }
  if ("japa" in deps) {
    return "japa";
  }
  if ("tape" in deps) {
    return "tape";
  }
  if ("mocha" in deps) {
    return "mocha";
  }

  return "N/A";
}
