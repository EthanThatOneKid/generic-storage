import type { Storer } from "../../storer.ts";
import type { Server } from "../server.ts";

/**
 * DefaultData is the data that is stored by the DefaultServer.
 *
 * The Key passed to the DefaultServer is the property name of the primary.
 * in a stored data record.
 */
export type DefaultData<Key extends string = "id"> =
  & {
    /**
     * Dev-defined primary key name.
     */
    $key: Key;

    /**
     * User-defined JSON properties.
     */
    [k: string]: unknown;
  }
  & {
    /**
     * Dev-defined property key.
     */
    [key in Key]: string;
  };

export class DefaultServer<Data extends DefaultData> implements Server<Data> {
  constructor(private readonly storage: Storer<string, Data>) {
  }

  public async get(key: string): Promise<Data> {
    return await this.storage.get(key);
  }

  public async set(data: Data): Promise<string> {
    const key = this.storage.key(data);
    await this.storage.set(data);
    return key;
  }

  public async remove(key: string): Promise<void> {
    await this.storage.remove(key);
  }

  public async list(data?: Partial<Data>): Promise<Data[]> {
    let keys: string[];

    if (!data) {
      keys = await this.storage.list();
    } else {
      const props = Object.keys(data);
      keys = await this.storage.list(/* filter=*/ (d) =>
        props.every((k) => JSON.stringify(d[k]) === JSON.stringify(data[k]))
      );
    }

    return await Promise.all(keys.map((k) => this.storage.get(k)));
  }

  public async clear(): Promise<void> {
    return await this.storage.clear();
  }
}
