import type { Client } from "../../../http/common/client.ts";
import type { Fetcher } from "../../../http/common/fetcher.ts";
import type { DefaultData } from "../../../http/common/default_data.ts";

export class DefaultClient implements Client<DefaultData> {
  constructor(
    public readonly origin: string,
    private readonly fetcher: Fetcher,
  ) {}

  async get(key: string, opts?: RequestInit): Promise<DefaultData> {
    const url = new URL(`${this.origin}/${key}`);
    const res = await this.fetcher.fetch(url, opts);
    return await res.json() as DefaultData;
  }

  async set(data: DefaultData, opts?: RequestInit) {
    const res = await this.fetcher.fetch(this.origin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      ...opts,
    });
    return await res.text();
  }

  async remove(key: string, opts?: RequestInit) {
    const url = new URL(`${this.origin}/${key}`);
    const res = await this.fetcher.fetch(url, { method: "DELETE", ...opts });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }
  }

  async list(
    data?: Partial<DefaultData>,
    opts?: RequestInit,
  ): Promise<DefaultData[]> {
    const res = await this.fetcher.fetch(this.origin, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      ...opts,
    });
    return await res.json() as DefaultData[];
  }

  async clear(opts?: RequestInit) {
    const res = await this.fetcher.fetch(this.origin, {
      method: "DELETE",
      ...opts,
    });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }
  }
}
