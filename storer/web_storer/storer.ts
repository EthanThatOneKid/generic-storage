import type { Storer } from "../storer.ts";

/**
 * A storage interface for the browser's local storage.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 */
export class WebStorer<Key extends string, Data> implements Storer<Key, Data> {
  private readonly internalKey = "__WebStorage.internalKey" as const;

  constructor(
    public readonly key: (data: Data) => Key,
    private readonly storage: Storage = localStorage,
  ) {
    this.storage.setItem(this.internalKey, "[]");
  }

  private getParsedItem(key: Key): Data {
    const item = this.storage.getItem(key);
    if (item === null) {
      throw new Error(`Item with key ${key} not found`);
    }

    return JSON.parse(item);
  }

  public get(key: Key): Promise<Data> {
    return Promise.resolve(this.getParsedItem(key));
  }

  public set(data: Data): Promise<void> {
    const newKey = this.key(data);
    this.storage.setItem(newKey, JSON.stringify(data));

    // Update internal list of keys.
    const internalKeys = this.storage.getItem(this.internalKey);
    const oldKeys = JSON.parse(internalKeys ?? "[]");
    const newKeys = [...oldKeys, newKey];
    this.storage.setItem(this.internalKey, JSON.stringify(newKeys));

    return Promise.resolve();
  }

  public remove(key: Key): Promise<void> {
    this.storage.removeItem(key);

    // Update internal list of keys.
    const internalKeys = this.storage.getItem(this.internalKey);
    const oldKeys = JSON.parse(internalKeys ?? "[]");
    const newKeys = oldKeys.filter((oldKey: Key) => oldKey !== key);
    this.storage.setItem(this.internalKey, JSON.stringify(newKeys));

    return Promise.resolve();
  }

  public list(filter?: (data: Data) => boolean): Promise<Key[]> {
    const internalKeys = this.storage.getItem(this.internalKey);
    const keys = JSON.parse(internalKeys ?? "[]") as Key[];

    const entries: Array<[Key, Data]> = keys.map((
      key: Key,
    ) => [key, this.getParsedItem(key)]);

    const filteredKeys =
      (filter ? entries.filter(([_, data]) => filter(data)) : entries).map((
        [key],
      ) => key);

    return Promise.resolve(filteredKeys);
  }

  public clear(): Promise<void> {
    this.storage.clear();

    // Update internal list of keys.
    this.storage.setItem(this.internalKey, "[]");

    return Promise.resolve();
  }
}
