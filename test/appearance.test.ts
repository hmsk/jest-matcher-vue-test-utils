import {
  toAppear,
  toDisappear,
  config
} from "@/index";

import Component from "./fixtures/error-message.vue";
import { createLocalVue, shallowMount } from "@vue/test-utils";

expect.extend({
  toAppear,
  toDisappear
});

config({
  mountOptions: { localVue: createLocalVue() }
});

describe("toAppear", () => {
  describe("matcher function", () => {
    it("returns true if shown by specified action", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      const result = toAppear(() => (wrapper.vm as any).showError(), wrapper, ".error");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe("The target appears by the action");
    });

    it("returns false if shown from the beginning", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      const result = toAppear(() => (wrapper.vm as any).showError(), wrapper, ".error");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The target appears from the beginning");
    });

    it("returns false if never shown", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      const result = toAppear(() => "do not anything", wrapper, ".error");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The target doesn't show even if the action runs");
    });
  });

  describe("actual use", () => {
    it("doesn't claim on correct expectation", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      expect(() => (wrapper.vm as any).showError()).toAppear(wrapper, ".error");
    });

    it("doesn't claim on incorrect expectation: appear -> *", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      expect(() => (wrapper.vm as any).showError()).not.toAppear(wrapper, ".error");
    });

    it("doesn't claim on incorrect expectation: disappear -> disappear", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      expect(() => "don't do nothing").not.toAppear(wrapper, ".error");
    });
  });
});

describe("toDisappear", () => {
  describe("matcher function", () => {
    it("returns true if hidden by specified action", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      const result = toDisappear(() => (wrapper.vm as any).hideError(), wrapper, ".error");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe("The target disappears by the action");
    });

    it("returns false if hidden from the beginning", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      const result = toDisappear(() => (wrapper.vm as any).hideError(), wrapper, ".error");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The target disappears from the beginning");
    });

    it("returns false if never hidden", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      const result = toDisappear(() => "do not anything", wrapper, ".error");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The target doesn't disappear even if the action runs");
    });
  });

  describe("actual use", () => {
    it("doesn't claim on correct expectation", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      expect(() => (wrapper.vm as any).hideError()).toDisappear(wrapper, ".error");
    });

    it("doesn't claim on incorrect expectation: disappear -> *", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      expect(() => (wrapper.vm as any).showError()).not.toDisappear(wrapper, ".error");
    });

    it("doesn't claim on incorrect expectation: appear -> appear", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      expect(() => "don't do nothing").not.toDisappear(wrapper, ".error");
    });
  });
});
