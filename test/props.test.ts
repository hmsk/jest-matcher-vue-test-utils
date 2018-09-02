import {
  toRequireProp,
  toHaveDefaultProp,
  toBeValidProps,
  toBeValidPropWithTypeCheck,
  toBeValidPropWithCustomValidator,
  config
} from "@/main";
import Component from "./fixtures/props.vue";
import { createLocalVue } from "@vue/test-utils";

expect.extend({
  toRequireProp,
  toHaveDefaultProp,
  toBeValidProps,
  toBeValidPropWithTypeCheck,
  toBeValidPropWithCustomValidator
});

config({
  mountOptions: { localVue: createLocalVue() }
});

const fakeJestContext = (expect: boolean = true) => {
  return {
    equals: (a: any, b: any) => expect
  };
};

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
      const result = toHaveDefaultProp.bind(fakeJestContext(true))(Component, "address", "Kitakyushu, Japan");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe("'address' prop is given 'Kitakyushu, Japan' as default");
    });

    it("returns false if not matches default value", () => {
      const result = toHaveDefaultProp.bind(fakeJestContext(false))(Component, "address", "Chofu, Japan");
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

describe("toBeValidProps", () => {
  describe("matcher function", () => {
    it("returns true if matches default value", () => {
      const result = toBeValidProps(Component, { name: "required name", fullName: "Kengo Hamasaki" });
      expect(result.pass).toBe(true);
      expect(result.message()).toBe("Props are valid");
    });

    it("returns false if not matches default value", () => {
      const result = toBeValidProps(Component, { fullName: "KengoHamasaki" });
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("Props are not valid");
    });
  });

  describe("actual use", () => {
    it("doesn't claim on correct expectation", () => {
      expect(Component).toBeValidProps({ name: "required name", fullName: "Kengo Hamasaki" });
    });

    it("doesn't claim on incorrect expectation", () => {
      expect(Component).not.toBeValidProps({ fullName: "KengoHamasaki" });
    });
  });
});

describe("toBeValidPropWithTypeCheck", () => {
  describe("matcher function", () => {
    it("returns true if passes custom validation", () => {
      const result = toBeValidPropWithTypeCheck(Component, "zipcode", "1390");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe("'zipcode' prop is valid with '1390'");
    });

    it("returns false if not passes custom validation", () => {
      const result = toBeValidPropWithTypeCheck(Component, "zipcode", 1390);
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("'zipcode' prop is invalid with '1390'");
    });
  });

  describe("actual use", () => {
    it("doesn't claim on correct expectation", () => {
      expect(Component).toBeValidPropWithTypeCheck("zipcode", "935");
    });

    it("doesn't claim on incorrect expectation", () => {
      expect(Component).not.toBeValidPropWithTypeCheck("zipcode", 935);
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
