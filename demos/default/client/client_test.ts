import { assertEquals, assertRejects } from "../../../test.deps.ts";

import { FakeFetcher } from "../../../http/common/fake_fetcher.ts";

import { DefaultClient } from "./client.ts";

const TEST_ORIGIN = "http://localhost:8080";
const FAKE_DATA_1 = { $key: "id", id: "1", name: "one" } as const;
const FAKE_DATA_2 = { $key: "id", id: "2", name: "two" } as const;

Deno.test("DefaultClient.get", async () => {
  const fetcher = new FakeFetcher({ [FAKE_DATA_1.id]: { ...FAKE_DATA_1 } });
  const client = new DefaultClient(TEST_ORIGIN, fetcher);
  const data = await client.get(FAKE_DATA_1.id);
  assertEquals(data, FAKE_DATA_1);
});

Deno.test("DefaultClient.get (not found)", async () => {
  const fetcher = new FakeFetcher({});
  const client = new DefaultClient(TEST_ORIGIN, fetcher);
  await assertRejects(
    async () => await client.get(FAKE_DATA_1.id),
  );
});

Deno.test("DefaultClient.set", async () => {
  const fetcher = new FakeFetcher();
  const client = new DefaultClient(TEST_ORIGIN, fetcher);
  const id = await client.set({ ...FAKE_DATA_2 });
  assertEquals(id, FAKE_DATA_2.id);
});

Deno.test("DefaultClient.remove", async () => {
  const fetcher = new FakeFetcher({ [FAKE_DATA_1.id]: { ...FAKE_DATA_1 } });
  const client = new DefaultClient(TEST_ORIGIN, fetcher);
  await client.remove(FAKE_DATA_1.id);
  assertEquals(fetcher.data, {});
});

Deno.test("DefaultClient.remove (500)", async () => {
  const fetcher = new FakeFetcher({}, 500);
  const client = new DefaultClient(TEST_ORIGIN, fetcher);
  try {
    await client.remove(FAKE_DATA_1.id);
    assertEquals(true, false);
  } catch {
    assertEquals(fetcher.data, {});
  }
});

Deno.test("DefaultClient.list", async () => {
  const fetcher = new FakeFetcher({
    [FAKE_DATA_1.id]: { ...FAKE_DATA_1 },
    [FAKE_DATA_2.id]: { ...FAKE_DATA_2 },
  });
  const client = new DefaultClient(TEST_ORIGIN, fetcher);
  const data = await client.list();
  assertEquals(data, [FAKE_DATA_1, FAKE_DATA_2]);
});

Deno.test("DefaultClient.list (error)", async () => {
  const fetcher = new FakeFetcher({}, 500);
  const client = new DefaultClient(TEST_ORIGIN, fetcher);
  try {
    await client.list();
    assertEquals(true, false);
  } catch {
    assertEquals(fetcher.data, {});
  }
});

Deno.test("DefaultClient.clear", async () => {
  const fetcher = new FakeFetcher({
    [FAKE_DATA_1.id]: { ...FAKE_DATA_1 },
    [FAKE_DATA_2.id]: { ...FAKE_DATA_2 },
  });
  const client = new DefaultClient(TEST_ORIGIN, fetcher);
  await client.clear();
  assertEquals(await client.list(), []);
});

Deno.test("DefaultClient.clear (500)", () => {
  const fetcher = new FakeFetcher({
    [FAKE_DATA_1.id]: { ...FAKE_DATA_1 },
    [FAKE_DATA_2.id]: { ...FAKE_DATA_2 },
  }, 500);
  const client = new DefaultClient(TEST_ORIGIN, fetcher);
  assertRejects(async () => await client.clear());
});
