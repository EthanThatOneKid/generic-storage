import type { Storer } from "../../storer/storer.ts";
import type { Server } from "../server.ts";

/**
 * HTTPServerData is the data that is stored in the HTTPServer.
 *
 * The Key passed to the HTTPServer is the property name of the primary.
 * in a stored data record.
 */
type HTTPServerData<Key extends string = "id"> =
  & {
    /**
     * Dev-defined property name of key.
     */
    $key: Key;

    /**
     * User-defined JSON properties.
     */
    [k: string]: unknown;
  }
  & {
    /**
     * The key of the dev-defined property name.
     */
    [key in Key]: string;
  };

export class HTTPServer<Data extends HTTPServerData> implements Server<Data> {
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

  public async list(data: Partial<Data>): Promise<Data[]> {
    const props = Object.keys(data);
    const keys = await this.storage.list(/* filter=*/ (d) =>
      props.every((k) => JSON.stringify(d[k]) === JSON.stringify(data[k]))
    );

    return await Promise.all(keys.map((k) => this.storage.get(k)));
  }

  public async clear(): Promise<void> {
    return await this.storage.clear();
  }
}
