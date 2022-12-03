import type { Server } from "./server.ts";

/**
 * FakeServer is a fake implementation of the Server interface.
 */
export class FakeServer<Data> implements Server<Data> {
  constructor(
    private readonly map: Map<string, Data> = new Map(),
  ) {}

  public get(key: string): Promise<Data> {
    const data = this.map.get(key);
    if (!data) {
      throw new Error(`Key not found: ${key}`);
    }
    return Promise.resolve(data);
  }

  public set(data: Data): Promise<string> {
    const key = JSON.stringify(data);
    this.map.set(key, data);
    return Promise.resolve(key);
  }

  public remove(key: string): Promise<void> {
    this.map.delete(key);
    return Promise.resolve();
  }

  public list(_?: Partial<Data>): Promise<Data[]> {
    return Promise.resolve(Array.from(this.map.values()));
  }

  public clear(): Promise<void> {
    this.map.clear();
    return Promise.resolve();
  }
}
