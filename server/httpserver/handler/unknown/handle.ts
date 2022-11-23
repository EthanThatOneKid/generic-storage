import { parse, serve } from "../../../../deps.ts";
import { WebStorer } from "../../../../storer/web_storer/mod.ts";
import { HTTPServer } from "../../mod.ts";

import { UnknownHandler } from "./handler.ts";

main();

function main() {
  const flags = parse(Deno.args);
  const port = Number(flags.port || flags.p) || 8080;

  const storage = new WebStorer((d: { $key: "id"; id: string }) => d.id);
  const server = new HTTPServer(storage);
  const { handle } = new UnknownHandler(server);
  serve(handle, { port });
}
