// Import Node.js Dependencies
import { after, describe, it } from "node:test";
import assert from "node:assert";

// Import Third-party Dependencies
import { MockAgent, setGlobalDispatcher } from "undici";

// Import Internal Dependencies
import { execute } from "../../src/plugins/nodesecure";

const kApiUrl = "https://api.securityscorecards.dev";

describe("execute()", async() => {
  const mockAgent = new MockAgent();
  mockAgent.disableNetConnect();

  const mockPool = mockAgent.get(kApiUrl);

  setGlobalDispatcher(mockAgent);

  after(async() => {
    await mockAgent.close();
  });

  it("should not add plugin", async() => {
    mockPool.intercept({ path: "/projects/github.com/NodeSecure/ossf-scorecard-sdk" }).reply(404).times(1);

    const repo: any = { name: "ossf-scorecard-sdk", plugins: {}, package_name: null };

    await execute("NodeSecure", repo);
    assert.equal(repo.package_name, null);
  });

  it("should add plugin", async() => {
    const repo: any = { name: "cli", plugins: {}, package_name: "@nodesecure/cli" };

    await execute("NodeSecure", repo);
    assert.deepEqual(repo.plugins.nodesecure.uniqueLicenseIds, ["MIT"]);
  });
});
