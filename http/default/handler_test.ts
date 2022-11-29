import { assertEquals } from "../../test.deps.ts";

import type { DefaultData } from "../common/default_data.ts";
import { FakeServer } from "../common/fake_server.ts";

import { DefaultHandler } from "./handler.ts";

const TEST_ORIGIN = "http://localhost:8080";
const TEST_DATA: DefaultData = { $key: "id", id: "1", foo: "bar" };
const TEST_SEED_DATA = new Map([[TEST_DATA.id, TEST_DATA]]);

const TEST_REQUEST_GET = new Request(new URL("/", TEST_ORIGIN));
const TEST_REQUEST_GET_1 = new Request(new URL("/1", TEST_ORIGIN));
const TEST_REQUEST_GET_2 = new Request(new URL("/?foo=bar", TEST_ORIGIN));
const TEST_REQUEST_POST = new Request(new URL("/", TEST_ORIGIN), {
  method: "POST",
  body: JSON.stringify(TEST_DATA),
});
const TEST_REQUEST_DELETE = new Request(new URL("/", TEST_ORIGIN), {
  method: "DELETE",
});
const TEST_REQUEST_DELETE_1 = new Request(new URL("/1", TEST_ORIGIN), {
  method: "DELETE",
});

Deno.test("DefaultHandler GET / should return 200 status", async () => {
  const s = new FakeServer<DefaultData>();
  const h = new DefaultHandler(s);
  const r = await h.handle(TEST_REQUEST_GET);
  assertEquals(r.status, 200);
});

Deno.test("DefaultHandler GET / should return JSON", async () => {
  const s = new FakeServer<DefaultData>(TEST_SEED_DATA);
  const h = new DefaultHandler(s);
  const r = await h.handle(TEST_REQUEST_GET_2);
  const b = await r.json();
  assertEquals(b, [TEST_DATA]);
});

Deno.test("DefaultHandler GET /:key should return 200 status for existing data", async () => {
  const s = new FakeServer(TEST_SEED_DATA);
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

Deno.test("DefaultHandler DELETE / should return 200 status and clear the storage", async () => {
  const s = new FakeServer(TEST_SEED_DATA);
  const h = new DefaultHandler(s);
  const r = await h.handle(TEST_REQUEST_DELETE);
  assertEquals(r.status, 200);
  assertEquals(await s.list(), []);
});

Deno.test("DefaultHandler DELETE /:key should return 200 status for existing data", async () => {
  const s = new FakeServer<DefaultData>(TEST_SEED_DATA);
  const h = new DefaultHandler(s);
  const r = await h.handle(TEST_REQUEST_DELETE_1);
  assertEquals(r.status, 200);
  assertEquals(await s.list(), []);
});

Deno.test("DefaultHandler DELETE /:key always returns 200 status even for non-existing data", async () => {
  const s = new FakeServer<DefaultData>();
  const h = new DefaultHandler(s);
  const r = await h.handle(TEST_REQUEST_DELETE_1);
  assertEquals(r.status, 200);
});

Deno.test("DefaultHander unsupported method should return 405 status", async () => {
  const s = new FakeServer<DefaultData>();
  const h = new DefaultHandler(s);
  const r = await h.handle(
    new Request(new URL("/", TEST_ORIGIN), {
      method: "PUT",
    }),
  );
  assertEquals(r.status, 405);
});
