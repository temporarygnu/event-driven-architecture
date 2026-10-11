import socketClient from "socket.io-client";
import { socketConnect } from "./__mocks__/connect.js";
import { describe, test, it } from "node:test";
import { Token, token } from "./__mocks__/tokens.js";
import { delay } from "./testing_tools.js";
import * as assert from "node:assert/strict";
import * as security from "../src/security.js";

describe("Security tools, tokens and measurements", async () => {
  await test("should connect the user if the credentials is ok", async () => {
    const decoded = security.decode(token);

    assert.ok(decoded, "The token should be valid, authenticated");
  });

  await test("should decode correctlly the token", async () => {
    const decoded = security.decode(token);

    assert.ok(decoded?.data?.email, "The token should have a user property");
    assert.ok(decoded?.data?._id, "The token should have a user id property");
  });

  await test("should authenticate the user if the token is valid", async () => {
    const decoded = security.decode(token);
    const authenticated = security.authenticate(decoded);

    assert.equal(authenticated, true, "The token is valid, authenticated");
  });
});