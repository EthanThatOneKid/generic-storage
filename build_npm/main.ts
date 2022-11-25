/* Build NPM package for development:
 * deno run -A https://etok.codes/generic-storage/raw/main/build_npm/main.ts 0.0.1 -r
 *
 * Build NPM package with custom remote:
 * deno run -A build_npm/main.ts 0.0.1 -r https://etok.codes/generic-storage/raw/$COMMIT_SHA
 *
 * Build NPM package locally for publication:
 * deno run -A build_npm/main.ts 0.0.1
 *
 * Publish NPM package:
 * npm adduser
 * cd npm && npm publish
 */

import { parse } from "https://deno.land/std@0.166.0/flags/mod.ts";
import { join } from "https://deno.land/std@0.166.0/path/posix.ts";

import type { BuildOptions } from "https://deno.land/x/dnt@0.32.0/mod.ts";
import { build, emptyDir } from "https://deno.land/x/dnt@0.32.0/mod.ts";
import { urlJoin } from "https://deno.land/x/url_join@1.0.0/mod.ts";

const defaultEntryPoint = "./demos/default/client/mod.ts";
const defaultRootTestDir = "./demos/default/client";
const defaultOutDir = "./npm";
const defaultTmpDir = "./tmp";
const defaultRemotePrefix =
  "https://github.com/ethanthatonekid/generic-storage/raw/main";

const defaultOptions: BuildOptions = {
  entryPoints: [defaultEntryPoint],
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

  const options = await consolidate(defaultOptions, remote);

  await build(options);

  // post build steps
  if (!remote) {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  }

  await emptyDir(defaultTmpDir);
}

/**
 * consolidate makes the entrypoint and root test dir paths relative to the
 * temporary files.
 */
async function consolidate(
  o: BuildOptions,
  arg: unknown,
  tmpDir = defaultTmpDir,
) {
  // Return default options if remote flag is not set.
  if (!arg) return o;

  // Disable type checking.
  o.typeCheck = false;

  // Disable testing.
  o.test = false;

  // Use default remote prefix if remote flag is set but no value is provided.
  const prefix = new URL(
    typeof arg === "string" && arg.startsWith("http")
      ? arg
      : defaultRemotePrefix,
  ).toString();

  // Download remote entry point files temporarily.
  o.entryPoints = await Promise.all(
    o.entryPoints.map(async (entryPoint) => {
      const path = (entryPoint as { path: string })?.path ?? entryPoint;
      const content = await (await fetch(urlJoin(prefix, path))).text();
      if (!content) {
        throw new Error("No content found");
      }

      const tmpPath = join(tmpDir, path);
      const remoteImportsOnly = replaceRelativeImportsWithRemoteURL(
        content,
        urlJoin(prefix, join(path, "..")),
      );

      await Deno.mkdir(join(tmpDir, path, ".."), { recursive: true });
      await Deno.writeTextFile(tmpPath, remoteImportsOnly);

      // Return temporary entry point path to remove after build.
      return tmpPath;
    }),
  );

  return o;
}

function replaceRelativeImportsWithRemoteURL(
  content: string,
  prefix: string,
) {
  // Regular expression derived from:
  // https://gist.github.com/manekinekko/7e58a17bc62a9be47172?permalink_comment_id=4349395#gistcomment-4349395
  const relativeImportPattern =
    /(import|export)(?:[\s.*]([\w*{}\n\r\t, ]+)[\s*]from)?[ \n\t]*(['"])(?:\.{1,2}(\/\.{2})*)([^'"\n]+)(?:['"])?/gm;
  const inlineRelativeImportPattern =
    /import\([ \n\t]*(['"])(?:\.{1,2}(\/\.{2})*)([^'"\n]+)(?:['"])\)/gm;

  return content
    .replaceAll(
      relativeImportPattern,
      (
        _,
        /* "import" =*/ keyword: string,
        /* "{ dep }" =*/ deps: string,
        /* "'" =*/ quote: string,
        __,
        /* "./mod.ts" =*/ relativePath: string,
      ) => {
        const left = `${keyword} ${deps ? `${deps} from ` : ""}`;
        const right = absolute(prefix, quote, relativePath);
        return `${left}${right}`;
      },
    ).replaceAll(
      inlineRelativeImportPattern,
      (
        _,
        /* "'" =*/ quote: string,
        __,
        /* "./mod.ts" =*/ relativePath: string,
      ) => `import(${absolute(prefix, quote, relativePath)})`,
    );
}

/**
 * absolute builds an absolute URL string given a relative path wrapped in quotes.
 *
 * This function additionally appends a unique cache-busting query parameter to the
 * URL.
 */
function absolute(
  prefix: string,
  quote: string,
  relativePath: string,
) {
  const u = new URL(urlJoin(prefix, relativePath));

  // Set cache query to avoid unintentionally-cached imports.
  u.searchParams.set("__CACHE", Math.random().toString(36).substring(2, 9));
  return `${quote}${u}${quote}`;
}
