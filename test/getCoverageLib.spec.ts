// Import Node.js Dependencies
import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Import Internal Dependencies
import { getCoverageLib } from "../src/utils/index.ts";

describe("getCoverageLib()", () => {
  it("Should return N/A", () => {
    assert.equal(getCoverageLib({ test: "2.0.0" }), "N/A");
  });

  it("Should return nyc", () => {
    assert.equal(getCoverageLib({ nyc: "2.0.0" }), "nyc");
  });

  it("Should return c8", () => {
    assert.equal(getCoverageLib({ c8: "2.0.0" }), "c8");
  });

  it("Should return jest", () => {
    assert.equal(getCoverageLib({ jest: "2.0.0" }), "jest");
  });

  it("Should return all libs", () => {
    assert.equal(getCoverageLib({ nyc: "2.0.0", c8: "1.0.5", jest: "1.6.0" }), "nyc,c8,jest");
  });
});
