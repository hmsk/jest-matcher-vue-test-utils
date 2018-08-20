import toBeRequiredProp from "@/main";
import { mount } from "@vue/test-utils";
import Component from "./fixtures/props.vue";

describe("props", () => {
  it("works", () => {
    const wrapper = mount(Component);
    expect((wrapper.vm as any).internal).toBe("hi");
    expect(toBeRequiredProp).toBeTruthy();
  });
});
