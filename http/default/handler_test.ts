// make sure everything returns 200 statusses
import { assertEquals } from "../../test.deps.ts";

import type { DefaultData } from "../common/default_data.ts";
import { FakeServer } from "../common/fake_server.ts";

import { DefaultHandler } from "./handler.ts";

const TEST_DATA = new Map<string, DefaultData>([
  ["1", { $key: "id", id: "1", foo: "bar" }],
]);

const TEST_ORIGIN = "http://localhost:8080";
const TEST_REQUEST_GET = new Request(new URL("/", TEST_ORIGIN));
const TEST_REQUEST_GET_1 = new Request(new URL("/1", TEST_ORIGIN));
const TEST_REQUEST_POST = new Request(new URL("/", TEST_ORIGIN), {
  method: "POST",
});
const TEST_REQUEST_DELETE = new Request(new URL("/", TEST_ORIGIN), {
  method: "DELETE",
});

Deno.test("DefaultHandler GET / should return 200 status", async () => {
  const s = new FakeServer<DefaultData>();
  const h = new DefaultHandler(s);
  const r = await h.handle(TEST_REQUEST_GET);
  assertEquals(r.status, 200);
});

Deno.test("DefaultHandler GET /:key should return 200 status for existing data", async () => {
  const s = new FakeServer(TEST_DATA);
  const h = new DefaultHandler(s);
  const r = await h.handle(TEST_REQUEST_GET_1);
  assertEquals(r.status, 200);
});

Deno.test("DefaultHandler GET /:key should return 404 status for non-existing data", async () => {
  const s = new FakeServer<DefaultData>();
  const h = new DefaultHandler(s);
  const r = await h.handle(TEST_REQUEST_GET_1);
  assertEquals(r.status, 404);
});

Deno.test("DefaultHandler POST / should return 200 status", async () => {
  const s = new FakeServer<DefaultData>();
  const h = new DefaultHandler(s);
  const r = await h.handle(TEST_REQUEST_POST);
  assertEquals(r.status, 200);
});

Deno.test("DefaultHandler DELETE / should return 200 status", async () => {
  const s = new FakeServer<DefaultData>();
  const h = new DefaultHandler(s);
  const r = await h.handle(TEST_REQUEST_DELETE);
  assertEquals(r.status, 200);
});
