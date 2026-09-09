import socketClient from "socket.io-client";
import { socketConnect } from "./__mocks__/connect";
import { Token, token } from "./__mocks__/tokens.js";
import io from "../index";
import { describe, test, it } from "node:test";
import * as assert from "node:assert/strict";

interface SocketioClient {
  emit(event: string, data: any): void;
  on(event: string, callback: (data: any) => void): void;
}

interface SocketMessage {
  data: string,
  message: string | "503"
}

async function delay(ms: number, fn: Function): PromiseLike<T> {
  const promise: PromiseLike<T> = new Promise((resolve: Function) => {
    return setTimeout(async () => {
      const _r = await fn();
      resolve(_r);
    }, ms)
  });
  
  return promise;
}

describe("Connection", async () => {
  await test("should connect the user to the api", (done: any) => {
    const socket_client = socketConnect(token);
    const SocketioConnections: SocketioClient[] = [];

    socket_client.on("connect", (socket: any) => {
      Object.keys(io.engine.clients).map((key) => {
        SocketioConnections.push(io.engine.clients[key]);
      });

      assert.ok(SocketioConnections.length >= 1, "Should connect to the server");
    });
  });

  test("should drop connection for unauthorized users", async () => {
    const SocketioConnections: SocketioClient[] = [];
    const token = false;
    const socket_client = socketConnect(token);

    function isSocketMessage(message: any): message is SocketMessage {
      return (message as SocketMessage).data !== undefined
        && (message as SocketMessage).message !== undefined;
    }

    Object.keys(io.engine.clients).map((key) => {
      SocketioConnections.push(io.engine.clients[key]);
    });

    assert.ok(SocketioConnections.length == 0, "Should drop the connection from server");

    // should mock the server receive the disconnect event
    socket_client.on("disconnect", (reason: String | SocketMessage) => {
      console.log(`socket client test, ${reason}`, reason)
      assert.ok(isSocketMessage(reason), "Should receive an Socket Message");
      assert.equal(reason, "503", "Should return 503 Access-Denide");
    });
  });

  await test("should drop users without permission headers", async (done: any) => {
    const socket_client = socketClient("http://localhost:3000", {
      path: "/",
      transports: ["pooling", "websocket"]
    });

    let connections: Object[] = [];

    Object.keys(io.engine.clients).map((key) => {
      connections.push(io.engine.clients[key]);
    });

    assert.ok(connections.length == 0, "shouldn't have the connection on the server side");
  });

  await test("should call services", { timeout: 5000 }, async () => {
    const client = socketClient(token);
    const event = { event: "api.services.status" };
    let message: undefined | String = undefined;
    
    client.emawait test("event", event);

    client.on("message", (data: String) => {
      message = data; 
    });

    await delay(2000, () => {
      assert.deepEqual(message, "online", "Should say the status 'online' for the user");
    });
  });

  await test.skip("should return an error message if a endpoint doesn`t exist", (done) => {
    const client = socketConnect(userToken);

    const event = {
      event: "api.service.test.testFuncFn",
      data: "You`re welcome"
    };

    client.emawait test("event", event);

    client.on("message", (data) => {
      expect(data).to.equals("TestFuncFn doesn't exist");
      done();
    });
  });

  await test.skip("should return an error message if a endpoint is nullish", (done) => {
    const client = socketConnect(userToken);

    const event = {
      data: "You`re welcome"
    };

    client.emawait test("event", event);

    client.on("message", (data) => {
      expect(data).to.equals("Event cannot be empty");
      done();
    });
  });
});
