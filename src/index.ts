// Import Internal Dependencies
import Github from "./services/github.js";
import * as plugins from "./plugins/index.js";

export interface IFetchOrgMetadataOptions {
  plugins: ("scorecard")[];
}

export async function fetchOrgMetadata(
  orgName: string,
  options: IFetchOrgMetadataOptions = { plugins: [] }
) {
  const githubRepository = new Github(orgName);

  const { avatar_url } = await githubRepository.information();
  const projects = await githubRepository.fetchRepositories();

  for (const pluginName of new Set(options.plugins)) {
    await Promise.allSettled(
      projects.map((repo) => plugins[pluginName].execute(orgName, repo))
    );
  }

  return {
    projects,
    logo: avatar_url
  };
}
