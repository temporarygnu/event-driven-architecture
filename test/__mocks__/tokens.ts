import { encode } from "../../src/security";

export type Token = UserToken | "fail";

interface UserToken {
  account_type: number,
  email: string,
  password: string,
  name: string,
  last_name: string,
  _id: string
};

export const jwt_user_buff: Token = {
  account_type: 1,
  email: "turbofan@proton.com",
  password: "manity",
  name: "Lukw",
  last_name: "wilkerson",
  _id: "5ddd9c08d64cec7cd249bdde"
};

export const token = encode(jwt_user_buff);