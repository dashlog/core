// Import Internal Dependencies
import Github from "./services/github.ts";
import * as plugins from "./plugins/index.ts";
import { type DashlogRepository } from "./services/repository.ts";

export type DashlogAllPlugins =
  plugins.nodesecure.NodesecurePlugin &
  plugins.scorecard.ScorecardPlugin;

export type DashlogPlugins = keyof typeof plugins;

export type DashlogOrganization<T extends object> = {
  logo: string;
  projects: DashlogRepository<T>[];
};

export interface FetchOrgMetadataOptions<Plugins extends DashlogPlugins> {
  plugins: Plugins[];
}

export async function fetchOrgMetadata<T extends DashlogPlugins>(
  orgName: string,
  options: FetchOrgMetadataOptions<T> = { plugins: [] }
): Promise<DashlogOrganization<Pick<DashlogAllPlugins, T>>> {
  const githubRepository = new Github(orgName);

  const { avatar_url } = await githubRepository.information();
  const projects = await githubRepository.fetchRepositories();

  for (const pluginName of new Set(options.plugins)) {
    await Promise.allSettled(
      projects.map((repo) => plugins[pluginName].execute(orgName, repo))
    );
  }

  return {
    logo: avatar_url,
    projects
  };
}

export { type DashlogRepository };
