// Import Third-party Dependencies
import * as scorecard from "@nodesecure/ossf-scorecard-sdk";

// Import Internal Dependencies
import { DashlogRepository } from "../services/repository.js";

export async function execute(
  orgName: string,
  repository: DashlogRepository
) {
  const scorecard = await fetchOpenSSFScorecard(orgName, repository.name);
  Object.assign(repository.plugins, { scorecard });
}

async function fetchOpenSSFScorecard(
  orgName: string,
  repositoryName: string
): Promise<scorecard.ScorecardResult | null> {
  try {
    return await scorecard.result(`${orgName}/${repositoryName}`);
  }
  catch {
    return null;
  }
}

