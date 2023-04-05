// Import Node.js Dependencies
import { test, after, describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";

// Import Internal Dependencies
import Github from "../src/services/github";

import { MockAgent, setGlobalDispatcher } from "undici";

const kMaxCommitFetch = 60;

const nsGithubOrg = JSON.parse(fs.readFileSync("./test/fixtures/nodesecure-github-org.json", "utf-8"));
const repositories = JSON.parse(fs.readFileSync("./test/fixtures/repos.json", "utf-8"));
const issues = JSON.parse(fs.readFileSync("./test/fixtures/issues.json", "utf-8"));
const pulls = JSON.parse(fs.readFileSync("./test/fixtures/pulls.json", "utf-8"));
const commits = JSON.parse(fs.readFileSync("./test/fixtures/commits.json", "utf-8"));
const packageJson = JSON.parse(fs.readFileSync("./test/fixtures/package.json", "utf-8"));
const repositoryNames = repositories.map((repo) => repo.name);

describe("Github", async() => {
  const mockAgent = new MockAgent();

  // TODO: Node 18 LTS (18.15.0) will run tests suites BEFORE the before() hook
  // It is fixed in v19 (tested with 19.8.1)
  // Wrap this is in before() hook when fixed in v18.
  mockAgent.disableNetConnect();

  const mockPool = mockAgent.get("https://api.github.com");
  mockPool.intercept({ path: "/orgs/NodeSecure" }).reply(200, nsGithubOrg, {
    headers: { "Content-Type": "application/json" }
  }).persist();
  mockPool.intercept({ path: "/orgs/NodeSecure/repos" }).reply(200, repositories, {
    headers: { "Content-Type": "application/json" }
  }).persist();

  for (const repo of repositoryNames) {
    mockPool.intercept({ path: `/repos/NodeSecure/${repo}/pulls` }).reply(200, pulls, {
      headers: { "Content-Type": "application/json" }
    }).persist();
    mockPool.intercept({ path: `/repos/NodeSecure/${repo}/issues` }).reply(200, issues, {
      headers: { "Content-Type": "application/json" }
    }).persist();
    mockPool.intercept({ path: `/repos/NodeSecure/${repo}/commits?per_page=${kMaxCommitFetch}` }).reply(200, commits, {
      headers: { "Content-Type": "application/json" }
    }).persist();
  }

  const rawPool = mockAgent.get("https://raw.githubusercontent.com");
  rawPool.intercept({
    path: /\/.*/
  }).reply(200, packageJson).persist();

  setGlobalDispatcher(mockAgent);
  // End of before() hook

  after(async() => {
    await mockAgent.close();
  });

  test("Github.information()", async() => {
    const github = new Github("NodeSecure");
    const data = await github.information();
    assert.deepEqual(data, nsGithubOrg);
  });

  it("Github.fetchRepositories()", async() => {
    const github = new Github("NodeSecure");
    const data = await github.fetchRepositories();
    const noArchivedOrDisabled = repositories.filter((repo) => !repo.archived && !repo.disabled);

    for (const repo of data) {
      assert.ok(noArchivedOrDisabled.find((r) => r.name === repo.name));
    }
  });

  it("@nodesecure/cli should have 30 unreleased commit from 09 Nov 2022", async() => {
    const github = new Github("NodeSecure");
    const data = await github.fetchRepositories();
    const cli = data.find((repo) => repo.name === "cli")!;
    assert.equal(cli.unreleased_commit_count, 30);
    assert.equal(cli.last_release, "09 Nov 2022, 01:27:09");
  });
});
