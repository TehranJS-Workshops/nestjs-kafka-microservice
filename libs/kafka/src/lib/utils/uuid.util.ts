import { v4, V4Options } from "uuid";

export function uuid(options: V4Options = {}) {
  return v4(options);
}
