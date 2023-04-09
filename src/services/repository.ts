// Import Node.js Dependencies
import path from "node:path";

// Import Third-party Dependencies
import * as httpie from "@myunisoft/httpie";
import * as Octokit from "@octokit/types";
import * as Dashlog from "@dashlog/fetch-github-repositories";
import * as scorecard from "@nodesecure/ossf-scorecard-sdk";
import { packument } from "@nodesecure/npm-registry-sdk";
import { PackageJson } from "@npm/types";

// Import Internal Dependencies
import Github from "./github.js";
import { getCoverageLib, getTestFrameworkName } from "../utils/index.js";

// CONSTANTS
const kMaxCommitFetch = 60;
const kDateFormatter = Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric"
});
const kPullUrlPostfixLen = "{/number}".length;
const kCommitUrlPostfixLen = "{/sha}".length;

export interface DashlogRepository {
  name: string;
  package_name: string | null;
  private: boolean;
  version: string;
  is_module: boolean;
  url: string;
  license: string;
  fork: boolean;
  fork_count: number;
  test_framework: string;
  coverage_lib: string;
  size: number;
  stars: number;
  last_commit: any;
  last_release: string | null;
  unreleased_commit_count: number | null;
  pull_request: string[];
  issues: string[];
  dependencies_count: number;
  dev_dependencies_count: number;
  nodejs_version: string | null;
  default_branch: string;
  plugins: {
    scorecard?: scorecard.ScorecardResult | null;
  }
}

export default class Repository {
  #org: Github;
  #repository: Dashlog.Repository;
  #commits: Octokit.Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"];

  constructor(org: Github, repository: Dashlog.Repository) {
    this.#org = org;
    this.#repository = repository;
  }

  async #fetchAdditionalGithubData() {
    const { full_name, pulls_url, issues_url } = this.#repository;

    // https://api.github.com/repos/NodeSecure/scanner/[pulls || issues]{/number} (example of pulls_url)
    //                                                                  ▲ here we slice this from the URL.
    const pull = pulls_url.slice(0, pulls_url.length - kPullUrlPostfixLen);
    const issue = issues_url.slice(0, issues_url.length - kPullUrlPostfixLen);

    const { data: pulls } = await httpie.get<Octokit.Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"]["data"]>(
      pull, { headers: this.#org.headers }
    );
    const { data: issues } = await httpie.get<Octokit.Endpoints["GET /repos/{owner}/{repo}/issues"]["response"]["data"]>(
      issue, { headers: this.#org.headers }
    );

    return {
      name: full_name,
      pr: pulls
        .filter((row) => row.user !== null)
        .map((row) => row.user!.login),
      issues: issues
        .filter((row) => row.user !== null)
        .map((row) => row.user!.login)
    };
  }

  async #fetchLastGithubCommit() {
    // eslint-disable-next-line max-len
    const uri = `${this.#repository.commits_url.slice(0, this.#repository.commits_url.length - kCommitUrlPostfixLen)}?per_page=${kMaxCommitFetch}`;

    const { data: commits } = await httpie.get<Octokit.Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"]>(
      uri, { headers: this.#org.headers }
    );
    this.#commits = commits;
    const lastCommit = commits[0];

    return {
      sha: lastCommit.sha,
      date: lastCommit.commit.author?.date ?? new Date().toUTCString()
    };
  }

  async #fetchGithubFile(
    fileName = "package.json"
  ): Promise<any> {
    try {
      const uri = `https://raw.githubusercontent.com/${this.#org.name}/${this.#repository.name}/master/${fileName}`;

      const { data } = await httpie.get<any>(uri, { headers: this.#org.headers });

      switch (path.extname(fileName)) {
        case ".json":
          return JSON.parse(data);
        default:
          return data;
      }
    }
    catch {
      return {};
    }
  }

  async #lastRelease(repository: string, version: string): Promise<string | null> {
    const pkg = await packument(repository);
    const lastRelease = pkg.time[version];
    const date = new Date(lastRelease);

    return kDateFormatter.format(date);
  }

  #unreleasedCommits(lastRelease: string | null) {
    if (lastRelease === null) {
      return null;
    }

    return this.#commits.filter((commit: any) => {
      const commitDate = kDateFormatter.format(new Date(commit.commit.author.date));

      return new Date(commitDate).getTime() > new Date(lastRelease).getTime();
    }).length;
  }

  async information(): Promise<DashlogRepository | null> {
    try {
      const [metadata, lastCommit, packageJSON] = await Promise.all([
        this.#fetchAdditionalGithubData(),
        this.#fetchLastGithubCommit(),
        this.#fetchGithubFile("package.json") as Promise<PackageJson & { type?: "module" | "commonjs" }>
      ]);

      const { pr, issues } = metadata;
      const {
        name = null, version = "1.0.0", engines = {}, dependencies = {}, devDependencies = {}, type
      } = packageJSON;
      lastCommit.date = kDateFormatter.format(new Date(lastCommit.date));

      const lastRelease = await this.#lastRelease(name ?? "", version);

      return {
        name: this.#repository.name,
        package_name: name,
        private: this.#repository.private,
        version,
        is_module: type === "module",
        url: this.#repository.html_url,
        license: (this.#repository.license || {}).name || "N/A",
        fork: this.#repository.fork,
        fork_count: this.#repository.forks_count,
        test_framework: getTestFrameworkName(devDependencies),
        coverage_lib: getCoverageLib(devDependencies),
        size: this.#repository.size,
        stars: this.#repository.stargazers_count,
        last_commit: lastCommit,
        last_release: lastRelease,
        unreleased_commit_count: this.#unreleasedCommits(lastRelease),
        pull_request: pr,
        issues,
        dependencies_count: Object.keys(dependencies).length,
        dev_dependencies_count: Object.keys(devDependencies).length,
        nodejs_version: engines.node || null,
        default_branch: this.#repository.default_branch,
        plugins: {}
      };
    }
    catch {
      return null;
    }
  }
}
