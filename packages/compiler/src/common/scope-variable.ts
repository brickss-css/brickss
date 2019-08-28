import { randomId } from "./hash";

/**
 * Returns scoped variable name: var-name__random-hash
 */
export function scopeVariable(name: string) {
  return name + "__" + randomId();
}
