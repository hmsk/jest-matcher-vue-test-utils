import { toRequireProp, toHaveDefaultProp, toBeValidPropWithCustomValidator, config } from "@/main";
import Component from "./fixtures/props.vue";
import { createLocalVue } from "@vue/test-utils";

expect.extend({ toRequireProp, toHaveDefaultProp, toBeValidPropWithCustomValidator });

config({
  mountOptions: { localVue: createLocalVue() }
});

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

    it("accepts dynamic mount option", () => {
      const mockMethod = jest.fn();
      const result = toRequireProp(Component, "name", { methods: { overwrite (tag: string) { mockMethod(tag) } }});
      expect(result.pass).toBe(true);
      expect(mockMethod).toHaveBeenCalled();
    });
  });

  describe("actual use", () => {
    it("doesn't claim on correct expectation", () => {
      expect(Component).toRequireProp("name");
    });

    it("doesn't claim on incorrect expectation", () => {
      expect(Component).not.toRequireProp("none");
    });

    it("accepts dynamic mount option", () => {
      const mockMethod = jest.fn();
      expect(Component).toRequireProp("name", { methods: { overwrite (tag: string) { mockMethod(tag) } }});
      expect(mockMethod).toHaveBeenCalled();
    });
  });
});

describe("toHaveDefaultProp", () => {
  describe("matcher function", () => {
    it("returns true if matches default value", () => {
      const result = toHaveDefaultProp(Component, "address", "Kitakyushu, Japan");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe("'address' prop is given 'Kitakyushu, Japan' as default");
    });

    it("returns false if not matches default value", () => {
      const result = toHaveDefaultProp(Component, "address", "Chofu, Japan");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("'address' prop is not given 'Chofu, Japan' as default (is given 'Kitakyushu, Japan')");
    });
  });

  describe("actual use", () => {
    it("doesn't claim on correct expectation", () => {
      expect(Component).toHaveDefaultProp("address", "Kitakyushu, Japan");
    });

    it("doesn't claim on incorrect expectation", () => {
      expect(Component).not.toRequireProp("Meguro, Japan");
    });
  });
});

describe("toBeValidPropWithCustomValidator", () => {
  describe("matcher function", () => {
    it("returns true if passes custom validation", () => {
      const result = toBeValidPropWithCustomValidator(Component, "fullname", "Kengo Hamasaki");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe("'fullname' prop is valid with 'Kengo Hamasaki'");
    });

    it("returns false if not passes custom validation", () => {
      const result = toBeValidPropWithCustomValidator(Component, "fullname", "NamikaHamasaki");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("'fullname' prop is invalid with 'NamikaHamasaki'");
    });
  });

  describe("actual use", () => {
    it("doesn't claim on correct expectation", () => {
      expect(Component).toBeValidPropWithCustomValidator("fullname", "Kengo Hamasaki");
    });

    it("doesn't claim on incorrect expectation", () => {
      expect(Component).not.toBeValidPropWithCustomValidator("fullname", "NamikaHamasaki");
    });
  });
});
