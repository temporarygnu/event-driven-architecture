import {suite, test} from "node:test";
import assert from "node:assert/strict";

suite("Node Test Runner", async () => {
  test("Should run node:test", async (t: any) => {
    assert.strictEqual(true, true, "test should pass");
  });
});