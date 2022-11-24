import { assertEquals } from "../../../test.deps.ts";

import { DefaultClient } from "./client.ts";
import { FakeFetch } from "./fake_fetch.ts";

const TEST_ORIGIN = "http://localhost:8080";
const FAKE_DATA_1 = { $key: "id", id: "1", name: "one" } as const;
const FAKE_DATA_2 = { $key: "id", id: "2", name: "two" } as const;

Deno.test("DefaultClient.get", async () => {
  const fetcher = new FakeFetch({ [FAKE_DATA_1.id]: { ...FAKE_DATA_1 } });
  const client = new DefaultClient(TEST_ORIGIN, fetcher);
  const data = await client.get(FAKE_DATA_1.id);
  assertEquals(data, FAKE_DATA_1);
});

Deno.test("DefaultClient.set", async () => {
  const fetcher = new FakeFetch();
  const client = new DefaultClient(TEST_ORIGIN, fetcher);
  const id = await client.set({ ...FAKE_DATA_2 });
  assertEquals(id, FAKE_DATA_2.id);
});

Deno.test("DefaultClient.remove", async () => {
  const fetcher = new FakeFetch({ [FAKE_DATA_1.id]: { ...FAKE_DATA_1 } });
  const client = new DefaultClient(TEST_ORIGIN, fetcher);
  await client.remove(FAKE_DATA_1.id);
});

Deno.test("DefaultClient.list", async () => {
  const fetcher = new FakeFetch({
    [FAKE_DATA_1.id]: { ...FAKE_DATA_1 },
    [FAKE_DATA_2.id]: { ...FAKE_DATA_2 },
  });
  const client = new DefaultClient(TEST_ORIGIN, fetcher);
  const data = await client.list();
  assertEquals(data, [FAKE_DATA_1, FAKE_DATA_2]);
});
