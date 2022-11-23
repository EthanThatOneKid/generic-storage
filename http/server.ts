type Key = string;

/**
 * Server is a Generic Storage server interface.
 */
export interface Server<Data> {
  get: (k: Key) => Promise<Data>;
  set: (d: Data) => Promise<Key>;
  remove: (k: Key) => Promise<void>;
  list: (d: Partial<Data>) => Promise<Data[]>;
  clear: () => Promise<void>;
}
