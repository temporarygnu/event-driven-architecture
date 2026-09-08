import { describe, test, it, expectFailure } from "node:test";
import * as assert from "node:assert/strict";
import * as tools from "../src/tools.ts"

describe("Tools", () => {
    test("should return the first element of an array", () => {
        const vector1: Array<T> = [[1, 2, 3], [4, 5, 6]];
        const vector2: Array<T> = [1, 2, 3, 4, 5, 6];

        assert.deepEqual(vector1[0], tools.init(vector1));
        assert.deepEqual(vector2[0], tools.init(vector2));
    });

    test("should return the last element of an array", () => {
        const vector1: Array<T> = [[1, 2, 3], [4, 5, 6]];
        const vector2: Array<T> = [1, 2, 3, 4, 5, 6];

        assert.deepEqual(vector1[vector1.length], tools.last(vector1));
        assert.deepEqual(vector2[vector2.length], tools.last(vector2));
    });

    test("should join the elements of an array", () => {
        const vector1: Array<T> = [[1, 2, 3]];
        const vector2: Array<T> = [1, 2, 3];
        const vector_ok: Array<T> = [[1, 2, 3], 1, 2, 3];

        assert.deepEqual(vector_ok, tools.join(vector1, vector2));
    });
});