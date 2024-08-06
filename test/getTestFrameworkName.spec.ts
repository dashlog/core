// Import Node.js Dependencies
import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Import Internal Dependencies
import { getTestFrameworkName } from "../src/utils";

describe("getTestFrameworkName()", () => {
  it("Should return N/A", () => {
    assert.equal(getTestFrameworkName({ test: "2.0.0", test2: "3.0.0" }), "N/A");
  });

  it("Should return ava", () => {
    const packageJson = {
      devDependencies: {
        ava: "^2.0.0"
      }
    };
    assert.equal(getTestFrameworkName(packageJson), "ava");
  });

  it("Should return jest", () => {
    const packageJson = {
      devDependencies: {
        jest: "^2.0.0"
      }
    };
    assert.equal(getTestFrameworkName(packageJson), "jest");
  });

  it("Should return japa", () => {
    const packageJson = {
      devDependencies: {
        japa: "^2.0.0"
      }
    };
    assert.equal(getTestFrameworkName(packageJson), "japa");
  });

  it("Should return tape", () => {
    const packageJson = {
      devDependencies: {
        tape: "^2.0.0"
      }
    };
    assert.equal(getTestFrameworkName(packageJson), "tape");
  });

  it("Should return mocha", () => {
    const packageJson = {
      devDependencies: {
        mocha: "^2.0.0"
      }
    };

    assert.equal(getTestFrameworkName(packageJson), "mocha");
  });

  it("Should return node:test", () => {
    const packageJson = {
      scripts: {
        test: "node --test"
      }
    };
    assert.equal(getTestFrameworkName(packageJson), "node:test");
  });
});
