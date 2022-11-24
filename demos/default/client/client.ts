import type { Client } from "../../../http/common/client.ts";
import type { Fetcher } from "../../../http/common/fetcher.ts";
import type { DefaultData } from "../../../http/common/default_data.ts";

export class DefaultClient implements Client<DefaultData> {
  constructor(
    public readonly origin: string,
    private readonly fetcher: Fetcher = { fetch: fetch },
  ) {}

  async get(key: string): Promise<DefaultData> {
    const url = new URL(`${this.origin}/${key}`);
    const res = await this.fetcher.fetch(url);
    return await res.json() as DefaultData;
  }

  async set(data: DefaultData) {
    const res = await this.fetcher.fetch(this.origin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.text();
  }

  async remove(key: string) {
    const url = new URL(`${this.origin}/${key}`);
    const res = await this.fetcher.fetch(url, { method: "DELETE" });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }
  }

  async list(data?: Partial<DefaultData>): Promise<DefaultData[]> {
    const res = await this.fetcher.fetch(this.origin, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json() as DefaultData[];
  }

  async clear() {
    const res = await this.fetcher.fetch(this.origin, { method: "DELETE" });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }
  }
}
