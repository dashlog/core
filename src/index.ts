// Import Internal Dependencies
import Github from "./services/github.js";

export async function fetchOrgMetadata(orgName: string) {
  const githubRepository = new Github(orgName);

  const { avatar_url } = await githubRepository.information();
  const projects = await githubRepository.fetchRepositories();

  return {
    projects,
    logo: avatar_url
  };
}
