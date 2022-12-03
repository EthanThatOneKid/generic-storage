import { assertEquals, assertRejects } from "../test.deps.ts";

import { WebStorer } from "./storer.ts";
import { FakeStorage } from "./fake_storage.ts";

interface TestItem {
  id: string;
  greeting: string;
}

const TEST_DATA_1: TestItem = { id: "1", greeting: "Hello" };
const TEST_DATA_2: TestItem = { id: "2", greeting: "Hola" };

Deno.test("WebStorer stores and removes an item", async () => {
  const key = (data: TestItem) => data.id;
  const storage = new WebStorer<string, TestItem>(key, new FakeStorage());

  await storage.set(TEST_DATA_1);
  assertEquals(await storage.get(key(TEST_DATA_1)), TEST_DATA_1);

  await storage.remove(key(TEST_DATA_1));
  assertRejects(
    async () => await storage.get(key(TEST_DATA_1)),
  );
});

Deno.test("WebStorer lists and clears some items", async () => {
  const key = (data: TestItem) => data.id;
  const storage = new WebStorer<string, TestItem>(key, new FakeStorage());

  await storage.set(TEST_DATA_1);
  await storage.set(TEST_DATA_2);
  assertEquals(await storage.list(), [TEST_DATA_1, TEST_DATA_2].map(key));

  await storage.clear();
  assertEquals(await storage.list(), []);
});

Deno.test("WebStorer lists and filters out some items", async () => {
  const key = (data: TestItem) => data.id;
  const storage = new WebStorer<string, TestItem>(key, new FakeStorage());

  await storage.set(TEST_DATA_1);
  await storage.set(TEST_DATA_2);
  const filter = (data: TestItem) => data.greeting.endsWith("o");
  assertEquals(await storage.list(filter), [TEST_DATA_1].map(key));

  await storage.clear();
  assertEquals(await storage.list(), []);
});
