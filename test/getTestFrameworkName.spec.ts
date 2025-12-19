// Import Node.js Dependencies
import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Import Internal Dependencies
import { getTestFrameworkName } from "../src/utils/index.ts";

describe("getTestFrameworkName()", () => {
  it("Should return N/A", () => {
    assert.equal(getTestFrameworkName({ name: "test", version: "1.0.0", test: "2.0.0", test2: "3.0.0" }), "N/A");
  });

  it("Should return ava", () => {
    const packageJson = {
      name: "test",
      version: "1.0.0",
      devDependencies: {
        ava: "^2.0.0"
      }
    };
    assert.equal(getTestFrameworkName(packageJson), "ava");
  });

  it("Should return jest", () => {
    const packageJson = {
      name: "test",
      version: "1.0.0",
      devDependencies: {
        jest: "^2.0.0"
      }
    };
    assert.equal(getTestFrameworkName(packageJson), "jest");
  });

  it("Should return japa", () => {
    const packageJson = {
      name: "test",
      version: "1.0.0",
      devDependencies: {
        "@japa/runner": "^2.0.0"
      }
    };
    assert.equal(getTestFrameworkName(packageJson), "japa");
  });

  it("Should return tape", () => {
    const packageJson = {
      name: "test",
      version: "1.0.0",
      devDependencies: {
        tape: "^2.0.0"
      }
    };
    assert.equal(getTestFrameworkName(packageJson), "tape");
  });

  it("Should return mocha", () => {
    const packageJson = {
      name: "test",
      version: "1.0.0",
      devDependencies: {
        mocha: "^2.0.0"
      }
    };

    assert.equal(getTestFrameworkName(packageJson), "mocha");
  });

  describe("node:test", () => {
    it("Should return node:test for test script", () => {
      const packageJson = {
        name: "test",
        version: "1.0.0",
        scripts: {
          test: "node --test"
        }
      };
      assert.equal(getTestFrameworkName(packageJson), "node:test");
    });

    it("Should return node:test when a nested script uses node --test", () => {
      const packageJson = {
        name: "test",
        version: "1.0.0",
        scripts: {
          test: "c8 --all --src ./src -r html npm run test-only",
          "test-only": "glob -c \"node --loader=esmock --no-warnings --test-concurrency 1 --test\" \"test/**/*.test.js\""
        }
      };
      assert.equal(getTestFrameworkName(packageJson), "node:test");
    });

    it("Should return node:test when a nested script uses node --test, recursively", () => {
      const packageJson = {
        name: "test",
        version: "1.0.0",
        scripts: {
          test: "npm run foo",
          foo: "npm run bar",
          bar: "node --test"
        }
      };
      assert.equal(getTestFrameworkName(packageJson), "node:test");
    });

    it("Should return node:test for test script when using tsx", () => {
      const packageJson = {
        name: "test",
        version: "1.0.0",
        scripts: {
          test: "tsx --test"
        }
      };
      assert.equal(getTestFrameworkName(packageJson), "node:test");
    });
  });
});
