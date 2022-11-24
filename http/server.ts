type Key = string;

/**
 * Server is a Generic Storage server interface.
 */
export interface Server<Data> {
  get: (k: Key) => Promise<Data>;
  set: (d: Data) => Promise<Key>;
  remove: (k: Key) => Promise<void>;
  list: (d?: Partial<Data>) => Promise<Data[]>;
  clear: () => Promise<void>;
}

/**
 * Client is a client for the DefaultServer.
 *
 * Client extends the Server interface to match its functionality.
 */
export interface Client<Data> extends Server<Data> {
  readonly origin: string;
}

/**
 * Fetcher is a function that fetches a URL.
 *
 * @todo extend FakeServer to simulate server responses on the client.
 */
export interface Fetcher {
  fetch: typeof fetch;
}
