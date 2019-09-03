import * as crypto from "crypto";
import * as path from "path";

function trim(str: string, len: number) {
  return str
    .split("")
    .slice(0, len)
    .join("");
}

/**
 * Creates a hash of certain length from input string.
 */
export function hash(data: string, len: number = 5) {
  let h = crypto.createHash("sha256");
  h.update(data);
  return trim(h.digest("hex"), len);
}

/**
 * Generates random ID of given length.
 */
export function randomId(len: number = 5) {
  return trim(crypto.randomBytes(256).toString("hex"), len);
}

export function getScopeNameFromFilePath(filePath: string): string {
  return path.basename(filePath).split(".")[0] + "-" + randomId(2);
}
