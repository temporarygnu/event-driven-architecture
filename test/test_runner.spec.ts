import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("Test Runner", () => {
  test("Should run node:assert with Typescript 7", (done: any) => {
    assert.deepEqual(true, true, "shoudl be true");
  });
});