import { parse } from "../../../../deps.ts";

import { serve } from "./serve.ts";

main();

function main() {
  const flags = parse(Deno.args);
  const port = Number(flags.port || flags.p) || 8080;

  serve({ port });
}
