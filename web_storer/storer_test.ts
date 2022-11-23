import { assertEquals, assertRejects } from "../deps.ts";

import { WebStorer } from "./storer.ts";
import { FakeStorage } from "./fake_storage.ts";

interface TestItem {
  id: string;
  greeting: string;
}

Deno.test("WebStorer stores and removes an item", async () => {
  const key = (data: TestItem) => data.id;
  const storage = new WebStorer<string, TestItem>(key, new FakeStorage());

  const item: TestItem = { id: "test", greeting: "Hello" };
  await storage.set(item);
  assertEquals(await storage.get(key(item)), item);

  await storage.remove(key(item));
  assertRejects(
    async () => await storage.get(key(item)),
  );
});

Deno.test("WebStorer lists and clears some items", async () => {
  const storage = new WebStorer<string, TestItem>(
    (data) => data.id,
    new FakeStorage(),
  );

  const item: TestItem = { id: "test", greeting: "Hello" };
  const item2: TestItem = { id: "test2", greeting: "Hello2" };
  await storage.set(item);
  await storage.set(item2);
  assertEquals(await storage.list(), [item.id, item2.id]);

  await storage.clear();
  assertEquals(await storage.list(), []);
});
