import type { HTTPServer } from "../../mod.ts";
import type { Handler } from "../mod.ts";

type UnknownHTTPServer = HTTPServer<{
  /** Primary key property name. */
  $key: "id";

  /** User-defined JSON properties. */
  id: string;
  [key: string]: unknown;
}>;

export class UnknownHandler implements Handler {
  constructor(private readonly server: UnknownHTTPServer) {}

  public async handle(r: Request): Promise<Response> {
    switch (r.method) {
      case "GET":
        return await this.handleGET(r);
      case "POST":
        return await this.handlePOST(r);
      case "DELETE":
        return await this.handleDELETE(r);
      default:
        return new Response("Method not allowed", { status: 405 });
    }
  }

  private async handleGET(r: Request): Promise<Response> {
    const u = new URL(r.url);

    switch (u.pathname) {
      case "/": {
        const data = await r.json();
        const list = await this.server.list(data);
        return new Response(JSON.stringify(list));
      }

      default: {
        const key = u.pathname.slice(1);
        const data = await this.server.get(key);
        return new Response(JSON.stringify(data));
      }
    }
  }

  private async handlePOST(r: Request): Promise<Response> {
    const data = await r.json();
    const key = await this.server.set(data);
    return new Response(key);
  }

  private async handleDELETE(r: Request): Promise<Response> {
    const u = new URL(r.url);

    switch (u.pathname) {
      case "/": {
        await this.server.clear();
        return new Response("OK");
      }

      default: {
        const key = u.pathname.slice(1);
        await this.server.remove(key);
        return new Response("OK");
      }
    }
  }
}
