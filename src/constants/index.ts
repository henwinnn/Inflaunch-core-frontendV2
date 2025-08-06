import PAIR_FACTORY_JSON from "./PAIR_FACTORY_ABI.json";
import TOKEN_FACTORY_JSON from "./TOKEN_FACTORY_ABI.json";
import PAIR_JSON from "./PAIR_ABI.json";
import TOKEN_JSON from "./TOKEN_ABI.json";

export const PAIR_FACTORY = PAIR_FACTORY_JSON;
export const TOKEN_FACTORY = TOKEN_FACTORY_JSON;
export const PAIR = PAIR_JSON;
export const TOKEN = TOKEN_JSON;

// Contract addresses dari environment variables
export const CONTRACTS = {
  PAIR_FACTORY: "0x8954B7c5eC1323EB181428143B906f8088cebf6f",
  TOKEN_FACTORY: "0x7c0F446fb5a72A5226f0DD3bd9f3b0F901Ce099d",
  PAIR: "",
  TOKEN: "",
} as const;
