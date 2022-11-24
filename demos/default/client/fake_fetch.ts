import { DefaultData } from "../../../http/default/server.ts";
import type { Fetcher } from "../../../http/mod.ts";

interface FakeData extends DefaultData {
  $key: "id";
}

/**
 * FakeFetch is a fake fetch function that simulates server responses on the client.
 */
export class FakeFetch implements Fetcher {
  constructor(
    public data: Record<string, FakeData> = {},
  ) {}

  public async fetch(
    input: string | URL | Request,
    init?: RequestInit | undefined,
  ): Promise<Response> {
    const url = new URL((input as Request).url ?? input.toString());
    const method = init?.method ?? "GET";
    const body: FakeData = JSON.parse(init?.body?.toString() ?? "{}");
    const headers = init?.headers ?? {};

    switch (method) {
      case "GET": {
        return await this.handleGET(
          url,
          new Headers({ ...headers, method }),
          body,
        );
      }

      case "POST": {
        return await this.handlePOST(
          url,
          new Headers({ ...headers, method }),
          body,
        );
      }

      case "DELETE": {
        return await this.handleDELETE(
          url,
          new Headers({ ...headers, method }),
          body,
        );
      }

      default: {
        return Promise.resolve(
          new Response("Method not allowed", { status: 405 }),
        );
      }
    }
  }

  private handleGET(u: URL, _: HeadersInit, __: FakeData): Promise<Response> {
    switch (u.pathname) {
      case "/": {
        const list = Object.values(this.data);
        return Promise.resolve(new Response(JSON.stringify(list)));
      }

      default: {
        const key = u.pathname.slice(1);
        const data = this.data[key];
        return Promise.resolve(new Response(JSON.stringify(data)));
      }
    }
  }

  private handlePOST(_: URL, __: HeadersInit, d: FakeData): Promise<Response> {
    this.data[d.id] = d;
    return Promise.resolve(new Response(d.id));
  }

  private handleDELETE(
    u: URL,
    _: HeadersInit,
    __: FakeData,
  ): Promise<Response> {
    switch (u.pathname) {
      case "/": {
        this.data = {};
        return Promise.resolve(new Response("OK"));
      }

      default: {
        const key = u.pathname.slice(1);
        delete this.data[key];
        return Promise.resolve(new Response("OK"));
      }
    }
  }
}
