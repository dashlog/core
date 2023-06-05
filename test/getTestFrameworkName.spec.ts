import { describe, it } from "node:test";
import assert from "node:assert";
import { getTestFrameworkName } from "../src/utils";

describe("getTestFrameworkName.js", () => {
  it("getTestFrameworkName should return N/A", () => {
    assert.strictEqual(getTestFrameworkName({ test: "2.0.0", test2: "3.0.0" }), "N/A");
  });
  it("getTestFrameworkName should return ava", () => {
    assert.strictEqual(getTestFrameworkName({ ava: "2.0.0" }), "ava");
  });
  it("getTestFrameworkName should return jest", () => {
    assert.strictEqual(getTestFrameworkName({ jest: "2.0.0" }), "jest");
  });
  it("getTestFrameworkName should return japa", () => {
    assert.strictEqual(getTestFrameworkName({ japa: "2.0.0" }), "japa");
  });
  it("getTestFrameworkName should return tape", () => {
    assert.strictEqual(getTestFrameworkName({ tape: "2.0.0" }), "tape");
  });
  it("getTestFrameworkName should return mocha", () => {
    assert.strictEqual(getTestFrameworkName({ mocha: "2.0.0" }), "mocha");
  });
});
