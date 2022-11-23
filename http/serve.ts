import type { ServeInit as StdServeInit } from "../deps.ts";
import { serve as stdServe } from "../deps.ts";

import type { Storer } from "../storer.ts";
import { WebStorer } from "../web_storer/mod.ts";

import type { DefaultData } from "./default/mod.ts";
import { DefaultHandler, DefaultServer } from "./default/mod.ts";

export interface ServeInit<Data extends DefaultData> extends StdServeInit {
  storage?: Storer<string, Data>;
}

/**
 * Serves HTTP requests with the given handler.
 *
 * You can specify an object with a port and hostname option, which is the
 * address to listen on. The default is port 8000 on hostname "0.0.0.0".
 *
 * You can change the listening address by the `hostname` and `port` options.
 * The below example serves with the port 3000.
 *
 * ```ts
 * import { serve } from "https://$MODULE_LOCATION/http/serve.ts";
 * serve({ port: 3000 });
 * ```
 *
 * `serve` function prints the message `Listening on http://<hostname>:<port>/`
 * on start-up by default. If you like to change this message, you can specify
 * `onListen` option to override it.
 *
 * ```ts
 * import { serve } from "https://$MODULE_LOCATION/http/serve.ts";
 * serve({
 *   onListen({ port, hostname }) {
 *     console.log(`Server started at http://${hostname}:${port}`);
 *     // ... more info specific to your server ..
 *   },
 * });
 * ```
 *
 * You can also specify `undefined` or `null` to stop the logging behavior.
 *
 * ```ts
 * import { serve } from "https://$MODULE_LOCATION/http/serve.ts";
 * serve({ onListen: undefined });
 * ```
 */
export function serve<Data extends DefaultData>(
  {
    storage: s = new WebStorer((d: Data) => d[d.$key]),
    ...o
  }: ServeInit<Data> = {},
): void {
  const { handle } = new DefaultHandler(new DefaultServer<Data>(s));
  stdServe(handle, o);
}