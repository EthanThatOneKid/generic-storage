export type Filter<Data> = (data: Data) => boolean;

export interface StorageInterface<Key extends string, Data> {
  get: (key: Key) => Promise<Data>;
  set: (data: Data) => Promise<void>;
  remove: (key: Key) => Promise<void>;
  list: (filter: Filter<Data>) => Promise<Key[]>;
  clear: () => Promise<void>;

  key: (data: Data) => Key;
}
