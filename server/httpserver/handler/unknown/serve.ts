import type { ServeInit as StdServeInit } from "../../../../deps.ts";
import { serve as stdServe } from "../../../../deps.ts";

import type { Storer } from "../../../../storer/mod.ts";
import { WebStorer } from "../../../../storer/web_storer/mod.ts";
import { HTTPServer } from "../../mod.ts";

import type { UnknownData } from "./handler.ts";
import { UnknownHandler } from "./handler.ts";

export interface ServeInit<Data extends UnknownData> extends StdServeInit {
  storage?: Storer<string, Data>;
}

export function serve<Data extends UnknownData>(
  {
    storage: s = new WebStorer((d: Data) => d[d.$key]),
    ...o
  }: ServeInit<Data>,
): void {
  const { handle } = new UnknownHandler(new HTTPServer(s));
  stdServe(handle, o);
}
