import test from "ava";
import { hash, randomId } from "./hash";

test("hash: creates a hash of certain length from a string", t => {
  t.is(hash("randomString").length, 5);
});

test("randomId: generates a random id of given length", t => {
  t.is(randomId().length, 5);
  t.not(randomId(), randomId());
});
