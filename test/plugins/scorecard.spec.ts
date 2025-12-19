// Import Node.js Dependencies
import { after, describe, it } from "node:test";
import assert from "node:assert";

// Import Third-party Dependencies
import { MockAgent, setGlobalDispatcher } from "undici";

// Import Internal Dependencies
import { execute } from "../../src/plugins/scorecard.ts";

const kApiUrl = "https://api.securityscorecards.dev";

describe("execute()", async() => {
  const mockAgent = new MockAgent();
  mockAgent.disableNetConnect();

  const mockPool = mockAgent.get(kApiUrl);

  setGlobalDispatcher(mockAgent);

  after(async() => {
    await mockAgent.close();
  });

  it("should fetch scorecard", async() => {
    mockPool
      .intercept({
        path: "/projects/github.com/NodeSecure/ossf-scorecard-sdk"
      })
      .reply(200, { foo: "bar" }, {
        headers: { "Content-Type": "application/json" }
      })
      .times(1);

    const repo: any = {
      name: "ossf-scorecard-sdk",
      plugins: {}
    };

    await execute("NodeSecure", repo);
    assert.strictEqual(repo.plugins.scorecard.foo, "bar");
  });

  it("should return null", async() => {
    mockPool
      .intercept({ path: "/projects/github.com/NodeSecure/cli" })
      .reply(404)
      .times(1);

    const repo: any = { name: "cli", plugins: {} };

    await execute("NodeSecure", repo);
    assert.strictEqual(repo.plugins.scorecard, null);
  });
});
