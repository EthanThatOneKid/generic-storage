import type { Server } from "./server.ts";

/**
 * Client is a client for the DefaultServer.
 *
 * Client extends the Server interface to match its functionality.
 */
export interface Client<Data> extends Server<Data> {
  readonly origin: string;
}
