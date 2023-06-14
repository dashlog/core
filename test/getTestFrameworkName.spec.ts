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
    assert.equal(getTestFrameworkName({ ava: "2.0.0" }), "ava");
  });

  it("Should return jest", () => {
    assert.equal(getTestFrameworkName({ jest: "2.0.0" }), "jest");
  });

  it("Should return japa", () => {
    assert.equal(getTestFrameworkName({ japa: "2.0.0" }), "japa");
  });

  it("Should return tape", () => {
    assert.equal(getTestFrameworkName({ tape: "2.0.0" }), "tape");
  });

  it("Should return mocha", () => {
    assert.equal(getTestFrameworkName({ mocha: "2.0.0" }), "mocha");
  });
});
