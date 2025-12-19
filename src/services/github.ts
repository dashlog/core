// Import Third-party Dependencies
import * as httpie from "@openally/httpie";
import type { Endpoints } from "@octokit/types";
import { fetchLazy } from "@dashlog/fetch-github-repositories";

// Import Internal Dependencies
import GithubRepository, { type DashlogRepository } from "./repository.ts";

export default class Github {
  public orgName: string;

  #token: string = process.env.GITHUB_TOKEN!;

  /**
   * @param {!string} orgName Github organization name
   *
   * @example
   * new Github("NodeSecure")
   */
  constructor(orgName: string) {
    this.orgName = orgName;
  }

  get name() {
    return this.orgName;
  }

  get headers() {
    return {
      "user-agent": this.orgName,
      authorization: `token ${this.#token}`,
      accept: "application/vnd.github.v3.raw"
    };
  }

  async information() {
    const { data } = await httpie.get<Endpoints["GET /orgs/{org}"]["response"]["data"]>(
      `https://api.github.com/orgs/${this.orgName}`,
      { headers: this.headers }
    );

    return data;
  }

  async fetchRepositories(): Promise<DashlogRepository[]> {
    const asyncIterator = fetchLazy(this.orgName, {
      kind: "orgs",
      token: this.#token
    });

    const arrOfPromises: (Promise<DashlogRepository | null>)[] = [];
    for await (const repo of asyncIterator) {
      if (!repo.archived && !repo.disabled) {
        const serviceRepository = new GithubRepository(this, repo);
        arrOfPromises.push(serviceRepository.information());
      }
    }

    const results = await Promise.allSettled(arrOfPromises);

    return results
      .filter((promise) => promise.status === "fulfilled" && promise.value !== null)
      .map((promise) => (promise as PromiseFulfilledResult<DashlogRepository>).value);
  }
}
