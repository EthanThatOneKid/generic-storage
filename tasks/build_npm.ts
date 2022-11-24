/* Run:
 *
 * ```
 * # run script example
 * deno run -A tasks/build_npm.ts 0.0.1
 *
 * # go to output directory and publish
 * cd npm
 * npm publish
 * ```
 */

import { build, emptyDir } from "https://deno.land/x/dnt@0.32.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./demos/default/client/mod.ts"],
  rootTestDir: "./demos/default/client",
  outDir: "./npm",
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
  // compilerOptions: {
  //   lib: ["dom", "esnext"],
  // },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
