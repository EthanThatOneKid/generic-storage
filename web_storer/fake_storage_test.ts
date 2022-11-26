import { assertEquals } from "../test.deps.ts";

import { FakeStorage } from "./fake_storage.ts";

Deno.test("FakeStorage matches localStorage API", () => {
  const storage = new FakeStorage();

  storage.setItem("test", "Hello");
  localStorage.setItem("test", "Hello");
  assertEquals(storage.getItem("test"), "Hello");
  assertEquals(localStorage.getItem("test"), "Hello");

  storage.removeItem("test");
  localStorage.removeItem("test");
  assertEquals(storage.getItem("test"), null);
  assertEquals(localStorage.getItem("test"), null);

  storage.clear();
  localStorage.clear();
  assertEquals(storage.getItem("test"), null);
  assertEquals(localStorage.getItem("test"), null);
});
