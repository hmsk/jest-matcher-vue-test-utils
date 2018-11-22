import {
  toBeEmitted,
  config
} from "@/index";

import Component from "./fixtures/event.vue";
import { createLocalVue, shallowMount } from "@vue/test-utils";

expect.extend({
  toBeEmitted
});

config({
  mountOptions: { localVue: createLocalVue() }
});

describe("toBeEmitted", () => {
  describe("as a function which is registered to jest", () => {
    it("returns true if the event is emitted", () => {
      const wrapper = shallowMount(Component);
      wrapper.trigger("click");
      const result = toBeEmitted(wrapper, "special");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe('The "special" event was emitted');
    });

    it("returns false if the event is not emitted", () => {
      const wrapper = shallowMount(Component);
      const result = toBeEmitted(wrapper, "special");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('The "special" event was never emitted');
    });

    it("returns false if the another event is emitted", () => {
      const wrapper = shallowMount(Component);
      wrapper.trigger("another");
      const result = toBeEmitted(wrapper, "special");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('The "special" event was never emitted');
    });
  });

  describe("actual use", () => {
    it("doesn't claim for positive expectation when expected event happens", () => {
      const wrapper = shallowMount(Component);
      wrapper.trigger("click");
      expect(wrapper).toBeEmitted("special");
    });

    it("doesn't claim for negative expectation when expected event doesn't happen", () => {
      const wrapper = shallowMount(Component);
      expect(wrapper).not.toBeEmitted("special");
    });

    it("doesn't claim for negative expectation when unintentional event happens", () => {
      const wrapper = shallowMount(Component);
      wrapper.trigger("another");
      expect(wrapper).not.toBeEmitted("special");
    });
  });
});
