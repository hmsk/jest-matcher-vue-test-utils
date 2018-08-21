import { toRequireProp } from "@/main";
import Component from "./fixtures/props.vue";

expect.extend({ toRequireProp });

describe("toRequireProp", () => {
  describe("matcher function", () => {
    it("returns true if matches to required prop", () => {
      const result = toRequireProp(Component, "name");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe("'name' prop is claimed as required");
    });

    it("returns false if not matches to required prop", () => {
      const result = toRequireProp(Component, "none");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("'none' prop is not claimed as required");
    });
  });

  describe("actual use", () => {
    it("doesn't claim on correct expectation", () => {
      expect(Component).toRequireProp("name");
    });

    it("doesn't claim on incorrect expectation", () => {
      expect(Component).not.toRequireProp("none");
    });
  });
});
