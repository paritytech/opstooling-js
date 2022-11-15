import { describe, it } from "@jest/globals";
import { equal } from "assert";

import { doValuesContainSameData } from "./comparison";

describe("doValuesContainSameData", () => {
  it("Values contain same data even if in different orders", () => {
    equal(doValuesContainSameData({ a: [1, 2] }, { a: [2, 1] }), true);
  });

  it("Values are different due to different keys", () => {
    equal(doValuesContainSameData({ a: [] }, { b: [] }), false);
  });

  it("Values are different due to missing keys", () => {
    equal(doValuesContainSameData({ a: [] }, {}), false);
  });

  it("Values contain same data for nested objects inside arrays", () => {
    equal(doValuesContainSameData({ a: [{ b: 1 }, { a: 2 }] }, { a: [{ a: 2 }, { b: 1 }] }), true);
  });

  it("Values contain same data for nested objects", () => {
    equal(doValuesContainSameData({ a: { b: 1 }, c: { d: 1 } }, { c: { d: 1 }, a: { b: 1 } }), true);
  });
});
