import socketClient from "socket.io-client";
import io from "../index.ts";
import { initializeServices, services, logServices } from "../src/initialize";
import { socketConnect } from "./__mocks__/connect.ts";
import { Token, token } from "./__mocks__/tokens.js";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

interface SocketioClientInterface {
  emit(event: string, data: any): void;
  on(event: string, callback: (data: any) => void): void;
}

interface SocketioEventInterface {
  "event": string 
}

describe("Service initialization", { timeout: 5000 }, async () => {
  await test("should initialize an mocked test API", async () => {
    const client = socketConnect(token);
    const mockedCall: SocketioEventInterface = {"event": "__mocks__.services.status"};
    let connections: SocketioClientInterface[] = [];

    Object.keys(io.engine.clients).map((key) => {
      connections.push(io.engine.clients[key]);
    });


    initializeServices(`${process.cwd()}/apis`);
    
    //setTimeout((reject, resolve) => resolve(), 90);

    client.emit(mockedCall.event);

    client.on("connect", (socket: SocketioClientInterface) => {
      assert.ok(connections.length > 0, "Should establish a connection");
    });

    client.on("message", (message: String) => {
      assert.equal(typeof message, "string", "Should return 'online'");
      assert.equal(message, "online", "Should return 'online' as message");
    });
  });
});
