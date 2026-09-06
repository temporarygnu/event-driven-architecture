import socketClient from "socket.io-client";
import { Token, token } from "./tokens";

export const socketConnect = (token: Token) => socketClient("http://localhost:3000", {
  path: "/",
  transports: ["pooling", "websocket"],
  extraHeaders: {
    authorization: token 
  }
});