// Import Third-party Dependencies
import * as scanner from "@nodesecure/scanner";
import { Mutex } from "@openally/mutex";

// Import Internal Dependencies
import { DashlogRepository } from "../services/repository.js";

// CONSTANTS
const kScannerLock = new Mutex({ concurrency: 5 });

export type NodesecurePlugin = {
  nodesecure?: scanner.tarball.ScannedPackageResult;
};

export async function execute(
  _orgName: string,
  repository: DashlogRepository<NodesecurePlugin>
) {
  if (repository.package_name === null) {
    return;
  }

  const free = await kScannerLock.acquire({
    delayBeforeAutomaticRelease: 10_000
  });

  try {
    const nodesecure = await scanner.verify(repository.package_name);
    Object.assign(repository.plugins, { nodesecure });
  }
  finally {
    free();
  }
}
