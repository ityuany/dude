import { expect, test } from "@rstest/core";
import * as core from "../src/index";

test("loads the core entry point", () => {
  expect(core).toBeDefined();
});
