import jwt from "jsonwebtoken";
import crypto from "crypto";
import { secret } from "./secret.js"

export type Token = JWTUserToken | false;

interface JWTUserToken {
  data: {
    account_type: number,
    email: string,
    password: string,
    name: string,
    last_name: string,
    _id: string
  },
  expiresIn: number,
  iat: number
}

export const passwordHash = (password) => {
  return crypto
    .createHmac("sha256", secret)
    .update(password)
    .digest("hex");
};

export const encode = (data) => {
  if (data == null) {
    return null;
  } else {
    let signed = jwt.sign({data:data, expiresIn: 60*60*24}, secret);
    return signed;
  }
};

export const decode = (token) => {
  return jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return false;
    }

    return decoded;
  });
};

export const authenticate = (decoded: JWTUserToken | false) => {
  console.log("decoded: ", decoded);
  
  const checker: Boolean = decoded === false
    || typeof decoded !== "object"
    || decoded?.data === null
    || decoded?.data === undefined;

  if (checker) return false;

  const date = new Date(0);
  const expires = date.setUTCSeconds(decoded?.expiresIn);
  const isExpired = expires.valueOf() > Date.now().valueOf();

  return isExpired !== false || decoded?.data?.account_type >= 0;
};
