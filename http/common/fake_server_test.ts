import { assertEquals } from "../../test.deps.ts";

import { FakeServer } from "./fake_server.ts";

Deno.test("FakeServer should return the same data as it was set", async () => {
  const s = new FakeServer();
  const key = await s.set({ foo: "bar" });
  const data = await s.get(key);
  assertEquals(data, { foo: "bar" });
});

Deno.test("FakeServer remove should remove the data", async () => {
  const s = new FakeServer();
  const key = await s.set({ foo: "bar" });
  await s.remove(key);
  try {
    await s.get(key);
    throw new Error("Should not be reached");
  } catch (e) {
    assertEquals(e.message, `Key not found: ${key}`);
  }
});

Deno.test("FakeServer list should return all data", async () => {
  const s = new FakeServer();
  await s.set({ foo: "bar" });
  await s.set({ foo: "baz" });
  const data = await s.list();
  assertEquals(data, [{ foo: "bar" }, { foo: "baz" }]);
});
