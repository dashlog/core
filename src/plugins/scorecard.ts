// Import Third-party Dependencies
import * as scorecard from "@nodesecure/ossf-scorecard-sdk";

// Import Internal Dependencies
import { type DashlogRepository } from "../services/repository.ts";

export type ScorecardPlugin = {
  scorecard?: scorecard.ScorecardResult | null;
};

export async function execute(
  orgName: string,
  repository: DashlogRepository<ScorecardPlugin>
) {
  const scorecard = await fetchOpenSSFScorecard(
    orgName,
    repository.name
  );

  Object.assign(repository.plugins, { scorecard });
}

async function fetchOpenSSFScorecard(
  orgName: string,
  repositoryName: string
): Promise<scorecard.ScorecardResult | null> {
  try {
    return await scorecard.result(`${orgName}/${repositoryName}`, {
      resolveOnNpmRegistry: false,
      resolveOnVersionControl: false
    });
  }
  catch {
    return null;
  }
}

