import { assertEquals } from "../../test.deps.ts";

import { FakeFetcher } from "./fake_fetcher.ts";

const FAKE_ORIGIN = "http://localhost:8080";
const FAKE_URL_1 = `${FAKE_ORIGIN}/1`;
const FAKE_DATA_1 = { $key: "id", id: "1", name: "one" } as const;
const FAKE_DATA_2 = { $key: "id", id: "2", name: "two" } as const;

Deno.test("FakeFetcher GET /:key gets stored data by key", async () => {
  const f = new FakeFetcher({ [FAKE_DATA_1.id]: FAKE_DATA_1 });
  const res = await f.fetch(FAKE_ORIGIN, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  assertEquals(res.status, 200);
  assertEquals(await res.json(), [FAKE_DATA_1]);
});

Deno.test("FakeFetcher GET /:key returns empty for missing data", async () => {
  const f = new FakeFetcher();
  const res = await f.fetch(FAKE_URL_1);
  assertEquals(await res.text(), "");
});

Deno.test("FakeFectcher GET / lists empty array", async () => {
  const f = new FakeFetcher();
  const res = await f.fetch(FAKE_ORIGIN);
  assertEquals(res.status, 200);
  assertEquals(await res.json(), []);
});

Deno.test("FakeFectcher GET / lists all data", async () => {
  const f = new FakeFetcher({
    [FAKE_DATA_1.id]: FAKE_DATA_1,
    [FAKE_DATA_2.id]: FAKE_DATA_2,
  });
  const res = await f.fetch(FAKE_ORIGIN, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  assertEquals(res.status, 200);
  assertEquals(await res.json(), [FAKE_DATA_1, FAKE_DATA_2]);
});

Deno.test("FakeFetcher POST / adds data to storage", async () => {
  const f = new FakeFetcher({ [FAKE_DATA_1.id]: { ...FAKE_DATA_1 } });
  const res = await f.fetch(FAKE_ORIGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(FAKE_DATA_2),
  });
  assertEquals(res.status, 200);
  assertEquals(await res.text(), FAKE_DATA_2.id);
  assertEquals(f.data, {
    [FAKE_DATA_1.id]: FAKE_DATA_1,
    [FAKE_DATA_2.id]: FAKE_DATA_2,
  });
});

Deno.test("FakeFetcher DELETE /:key removes data from storage by key", async () => {
  const f = new FakeFetcher({ [FAKE_DATA_1.id]: FAKE_DATA_1 });
  const res = await f.fetch(FAKE_URL_1, { method: "DELETE" });
  assertEquals(res.status, 200);
  assertEquals(f.data, {});
});

Deno.test("FakeFetcher DELETE /:key does not care about missing data", async () => {
  const f = new FakeFetcher();
  const res = await f.fetch(FAKE_URL_1, { method: "DELETE" });
  assertEquals(res.status, 200);
  assertEquals(f.data, {});
});

Deno.test("FakeFetcher DELETE / clears storage", async () => {
  const f = new FakeFetcher({ [FAKE_DATA_1.id]: FAKE_DATA_1 });
  const res = await f.fetch(FAKE_ORIGIN, { method: "DELETE" });
  assertEquals(res.status, 200);
  assertEquals(f.data, {});
});

Deno.test("FakeFetcher disallowed methods return 405", async () => {
  const f = new FakeFetcher();
  const res = await f.fetch(FAKE_ORIGIN, { method: "PUT" });
  assertEquals(res.status, 405);
});
