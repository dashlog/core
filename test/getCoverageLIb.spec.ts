import { describe, it } from "node:test";
import assert from "node:assert";
import { getCoverageLib } from "../src/utils";

describe("getCoverageLib.js", () => {
  it("getCoverageLib should return N/A", () => {
    assert.strictEqual(getCoverageLib({ test: "2.0.0" }), "N/A");
  });

  it("getCoverageLib should return nyc", () => {
    assert.strictEqual(getCoverageLib({ nyc: "2.0.0" }), "nyc");
  });
  it("getCoverageLib should return c8", () => {
    assert.strictEqual(getCoverageLib({ c8: "2.0.0" }), "c8");
  });
  it("getCoverageLib should return jest", () => {
    assert.strictEqual(getCoverageLib({ jest: "2.0.0" }), "jest");
  });
  it("getCoverageLib should return all libs", () => {
    assert.strictEqual(getCoverageLib({ nyc: "2.0.0", c8: "1.0.5", jest: "1.6.0" }), "nyc,c8,jest");
  });
});
