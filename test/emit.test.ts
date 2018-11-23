import {
  toBeEmitted,
  toBeEmittedWith,
  config
} from "@/index";

import Component from "./fixtures/event.vue";
import { createLocalVue, shallowMount } from "@vue/test-utils";

expect.extend({
  toBeEmitted,
  toBeEmittedWith
});

config({
  mountOptions: { localVue: createLocalVue() }
});

const fakeJestContext = (expect: boolean = true) => {
  return {
    equals: (a: any, b: any) => expect
  };
};

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

describe.only("toBeEmittedWith", () => {
  const emitEvent = (wrapper, eventName, payload) => {
    (wrapper.vm as any).emitEventWithPayload(eventName, payload);
  };

  describe("as a function which is registered to jest", () => {
    it("returns true if the event is emitted with the expected payload", () => {
      const wrapper = shallowMount(Component);
      emitEvent(wrapper, "special", { value: "something" });
      const result = toBeEmittedWith.bind(fakeJestContext(true))(wrapper, "special", "something");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe('The "special" event was emitted with the expected payload');
    });

    it("returns false if the event is not emitted", () => {
      const wrapper = shallowMount(Component);
      const result = toBeEmittedWith(wrapper, "special", "something");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('The "special" event was never emitted');
    });

    it("returns false if the another event is emitted", () => {
      const wrapper = shallowMount(Component);
      emitEvent(wrapper, "another", { value: "something" });
      const result = toBeEmittedWith(wrapper, "special", "something");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('The "special" event was never emitted');
    });

    it("returns false if the event is emitted but the payload is not matched", () => {
      const wrapper = shallowMount(Component);
      emitEvent(wrapper, "special", { value: "anything" });
      const result = toBeEmittedWith.bind(fakeJestContext(false))(wrapper, "special", "something");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('The "special" event was emitted but the payload is not matched');
    });
  });

  describe("actual use", () => {
    it("passes for expected case positively", () => {
      const wrapper = shallowMount(Component);
      emitEvent(wrapper, "special", { value: "actual life" });
      expect(wrapper).toBeEmittedWith("special", { value: "actual life" });
    });

    it("passes negatively when any event was not emitted", () => {
      const wrapper = shallowMount(Component);
      expect(wrapper).not.toBeEmittedWith("special", { value: "unusual life" });
    });

    it("passes negatively when unintentional event was emitted", () => {
      const wrapper = shallowMount(Component);
      emitEvent(wrapper, "another", { value: "actual life" });
      expect(wrapper).not.toBeEmittedWith("special", { value: "unusual life" });
    });

    it("passes negatively when the expected event is emitted but the payload is not matched", () => {
      const wrapper = shallowMount(Component);
      emitEvent(wrapper, "special", { value: "actual life" });
      expect(wrapper).not.toBeEmittedWith("special", { value: "exciting life" });
    });
  });
});
