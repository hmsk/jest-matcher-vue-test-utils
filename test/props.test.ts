import { toRequireProp } from "@/main";
import { mount } from "@vue/test-utils";
import Component from "./fixtures/props.vue";

expect.extend({ toRequireProp });

describe("props", () => {
  it("works", () => {
    const wrapper = mount(Component);
    expect((wrapper.vm as any).internal).toBe("hi");
    expect(wrapper).toRequireProp("hello");
  });
});
