/* Build NPM package:
 * deno run -A tasks/build_npm.ts 0.0.1 -r
 *
 * Build NPM package with custom remote:
 * deno run -A tasks/build_npm.ts 0.0.1 -r https://github.com/ethanthatonekid/generic-storage/raw/$COMMIT_SHA
 *
 * Build NPM package locally:
 * deno run -A tasks/build_npm.ts 0.0.1
 *
 * Publish NPM package:
 * npm adduser
 * cd npm && npm publish
 */

import { parse } from "https://deno.land/std@0.165.0/flags/mod.ts";
import { join } from "https://deno.land/std@0.165.0/path/posix.ts";

import type {
  BuildOptions,
  EntryPoint,
} from "https://deno.land/x/dnt@0.32.0/mod.ts";
import { build, emptyDir } from "https://deno.land/x/dnt@0.32.0/mod.ts";

const defaultEntrypoint = "./demos/default/client/mod.ts";
const defaultRootTestDir = "./demos/default/client";
const defaultOutDir = "./npm";
const defaultRemotePrefix =
  "https://github.com/ethanthatonekid/generic-storage/raw/main";

const defaultOptions: BuildOptions = {
  entryPoints: [defaultEntrypoint],
  rootTestDir: defaultRootTestDir,
  outDir: defaultOutDir,
  shims: {
    // see JS docs for overview and more options
    deno: true,
    // shim fetch, File, FormData, Headers, Request, and Response by using the "undici" package
    undici: true,
  },
  // package.json properties
  package: {
    name: "generic-storage",
    // remove the leading `v` in the tag name if it exists
    version: Deno.args[0]?.replace(/^v/, ""),
    description: "Client for generic key-value storage HTTP server.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/ethanthatonekid/generic-storage.git",
    },
    bugs: {
      url: "https://github.com/ethanthatonekid/generic-storage/issues",
    },
  },
};

await main();

async function main() {
  await emptyDir(defaultOutDir);

  const flags = parse(Deno.args);
  const remote = flags.r || flags.remote;

  const options: BuildOptions = { ...defaultOptions };
  if (remote) {
    options.entryPoints = defaultOptions.entryPoints.map((entryPoint) =>
      consolidate(entryPoint, remote)
    );
    options.rootTestDir = consolidate(defaultOptions.rootTestDir, remote);
  }

  await build(options);

  // post build steps
  Deno.copyFileSync("LICENSE", "npm/LICENSE");
  Deno.copyFileSync("README.md", "npm/README.md");
}

function consolidate(
  path: string | EntryPoint | undefined,
  remoteArg: unknown,
): string {
  return join(
    typeof remoteArg === "string" && remoteArg.startsWith("https://")
      ? remoteArg
      : defaultRemotePrefix,
    (path as { path: string })?.path ?? path,
  );
}
