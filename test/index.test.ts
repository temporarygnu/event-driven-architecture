import sinon from "sinon";
import { expect } from "chai";
import socketClient from "socket.io-client";
import io from "../index";
import { socketConnect } from "./__mocks__/connect";
import { Token, token } from "./__mocks__/tokens";
import * as test from "node:test";
import * as assert from "node:assert";

interface SocketioClient {
  emit(event: string, data: any): void;
  on(event: string, callback: (data: any) => void): void;
}

interface SocketMessage {
  data: string,
  message: string | "503"
}

beforeEach(async () => {
  sinon.restore();
});

suite.only("Connection", async (t: any) => {
  test.only("should connect the user to the api", (done: any) => {
    const client = socketConnect(token);
    const SocketioConnections: SocketioClient[] = [];

    client.on("connect", (socket: any) => {
      Object.keys(io.engine.clients).map((key) => {
        SocketioConnections.push(io.engine.clients[key]);
      });

      assert.strictEqual(SocketioConnections.length, 1, "There should be one connection");
    });
  });

  test.skip("should drop connection for unauthorized users", async (done: any) => {
    const SocketioConnections: SocketioClient[] = [];
    const token = false;
    const socket_client = socketConnect(token);

    interface PromiseFunction {
      done: Function;
      socket: SocketIOClient.Socket;
    }

    function isSocketMessage(message: any): message is SocketMessage {
      return (message as SocketMessage).data !== undefined
        && (message as SocketMessage).message !== undefined;
    }

    async function client_test(Value: PrmiseFunction): Promise<void> {
      const { done, socket } = Value;
      console.log("client_test: socket: ", socket instanceof Object);
      expect(false).to.be.true;
      expect(typeof socket).to.be.equals('object');
      expect(socket instanceof Object).to.be.equals(true);

      socket.on("disconnect", (reason: String | SocketMessage) => {
        console.log("disconnecting", reason);
        expect(false).to.be.equals(true);
        expect(isSocketMessage(reason)).to.be.equals(true);
        expect(reason).to.equals("503");
        expect(SocketioConnections.length).to.equals(0);

        return Promise.resolve(done);
      });
    };


    async function delay_test(done: Function, socket_client: SocketIOClient.Socket): Promise<Function> {
      return setTimeout((resolve: Function, reject: Function): PromiseFunction => {
        Object.keys(io.engine.clients).map((key) => {
          SocketioConnections.push(io.engine.clients[key]);
        });

        const promise: Promise<PromiseFunction> = new Promise((resolve, reject) => {
          const PromiseReturn: PromiseFunction = {
            done: done,
            socket: socket_client
          }

          resolve(PromiseReturn);
        })

        return promise;
      }, 1000);
    };

    //expect(false).to.be.true;
    assert.strictEqual(true, false, "There should be no connections");
    done();

    /*
    return delay_test(done, socket_client)
      .then(client_test)
      .then(done());
      */
  });

  it("should block users without permission headers", (done) => {
    const client = socketClient("http://localhost:3000", {
      path: "/",
      transports: ["pooling", "websocket"]
    });

    let connections = [];
    Object.keys(io.engine.clients).map((key) => {
      connections[key] = key;
    });

    expect(connections.length).to.equals(0);
    done();
  });

  it("should call services", (done) => {
    const client = socketConnect(userToken);

    const event = { event: "api.services.status" };

    client.emit("event", event);

    client.on("message", (data) => {
      expect(data).to.equals("online");
      done();
    });
  });

  it("should return an error message if a endpoint doesn`t exist", (done) => {
    const client = socketConnect(userToken);

    const event = {
      event: "api.service.test.testFuncFn",
      data: "You`re welcome"
    };

    client.emit("event", event);

    client.on("message", (data) => {
      expect(data).to.equals("TestFuncFn doesn't exist");
      done();
    });
  });

  it("should return an error message if a endpoint is nullish", (done) => {
    const client = socketConnect(userToken);

    const event = {
      data: "You`re welcome"
    };

    client.emit("event", event);

    client.on("message", (data) => {
      expect(data).to.equals("Event cannot be empty");
      done();
    });
  });
});
