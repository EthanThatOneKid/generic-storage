import type { Client, Fetcher } from "../../../http/server.ts";
import type { DefaultData } from "../../../http/default/server.ts";

export class DefaultClient implements Client<DefaultData> {
  constructor(
    public readonly origin: string,
    private readonly fetcher: Fetcher = { fetch },
  ) {}

  async get(key: string) {
    const url = new URL(`${this.origin}/${key}`);
    const res = await this.fetcher.fetch(url);
    return await res.json();
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

  async list(data?: Partial<DefaultData>) {
    const res = await this.fetcher.fetch(this.origin, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  }

  async clear() {
    const res = await this.fetcher.fetch(this.origin, { method: "DELETE" });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }
  }
}
