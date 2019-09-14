import { blockStatement } from "@babel/types";

export function safeProp<T>(obj: any, pathString: string, defaultValue: T): T {
  let value = obj;

  if (!value) {
    return defaultValue;
  }

  for (let key of pathString.split(".")) {
    if (value.hasOwnProperty(key)) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }

  return value as T;
}
