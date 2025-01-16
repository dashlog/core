// Import Third-party Dependencies
import type { PackageJSON } from "@nodesecure/npm-types";

// CONSTANTS
const kNodeTestRunnerRegex = /[node|tsx]\s+.*--test/;

export function getTestFrameworkName(packageJson: PackageJSON): string {
  const { devDependencies: deps = {}, scripts = {} } = packageJson;

  if (isUsingNodeTestRunner(scripts, "test")) {
    return "node:test";
  }
  if ("ava" in deps) {
    return "ava";
  }
  if ("jest" in deps) {
    return "jest";
  }
  if ("@japa/runner" in deps) {
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

function isUsingNodeTestRunner(scripts: Record<string, string>, scriptName: string, visited = new Set<string>()): boolean {
  if (visited.has(scriptName)) {
    return false;
  }

  const scriptCommand = scripts[scriptName];
  if (scriptCommand && kNodeTestRunnerRegex.test(scriptCommand)) {
    return true;
  }

  const calledScripts = extractCalledScripts(scriptCommand);

  for (const calledScript of calledScripts) {
    if (isUsingNodeTestRunner(scripts, calledScript, visited)) {
      return true;
    }
  }

  return false;
}

function extractCalledScripts(scriptCommand: string): string[] {
  const npmRunRegex = /npm run (\S+)/g;

  const calledScripts: string[] = [];

  let match: RegExpExecArray | null;

  while ((match = npmRunRegex.exec(scriptCommand)) !== null) {
    calledScripts.push(match[1]);
  }

  return calledScripts;
}
