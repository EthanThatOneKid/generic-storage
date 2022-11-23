import { assertEquals } from "../../../deps.ts";

import { FakeFetch } from "./fake_fetch.ts";

const FAKE_ORIGIN = "http://localhost:8080";
const FAKE_URL_1 = `${FAKE_ORIGIN}/1`;
const FAKE_DATA_1 = { $key: "id", id: "1", name: "one" } as const;
const FAKE_DATA_2 = { $key: "id", id: "2", name: "two" } as const;

Deno.test("FakeFetch.get", async () => {
  const f = new FakeFetch({ [FAKE_DATA_1.id]: { ...FAKE_DATA_1 } });
  const res = await f.fetch(FAKE_URL_1);
  assertEquals(res.status, 200);
  assertEquals(await res.json(), FAKE_DATA_1);
});

Deno.test("FakeFetch.set", async () => {
  const f = new FakeFetch({ [FAKE_DATA_1.id]: { ...FAKE_DATA_1 } });
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

Deno.test("FakeFetch.remove", async () => {
  const f = new FakeFetch({ [FAKE_DATA_1.id]: FAKE_DATA_1 });
  const res = await f.fetch(FAKE_URL_1, { method: "DELETE" });
  assertEquals(res.status, 200);
  assertEquals(f.data, {});
});

Deno.test("FakeFetch.list", async () => {
  const f = new FakeFetch({ [FAKE_DATA_1.id]: FAKE_DATA_1 });
  const res = await f.fetch(FAKE_ORIGIN, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  assertEquals(res.status, 200);
  assertEquals(await res.json(), [FAKE_DATA_1]);
});

Deno.test("FakeFetch.clear", async () => {
  const f = new FakeFetch({ [FAKE_DATA_1.id]: FAKE_DATA_1 });
  const res = await f.fetch(FAKE_ORIGIN, { method: "DELETE" });
  assertEquals(res.status, 200);
  assertEquals(f.data, {});
});
