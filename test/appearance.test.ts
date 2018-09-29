import {
  toShow,
  toHide,
  config
} from "@/index";

import Component from "./fixtures/error-message.vue";
import { createLocalVue, shallowMount } from "@vue/test-utils";

expect.extend({
  toShow,
  toHide
});

config({
  mountOptions: { localVue: createLocalVue() }
});

describe("toShow", () => {
  describe("as a function which is registered to jest", () => {
    it("returns true if the target is shown by specified action", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      const result = toShow(() => (wrapper.vm as any).showError(), wrapper, ".error");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe("The action shows the target");
    });

    it("returns false if ther target is shown from the beginning", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      const result = toShow(() => (wrapper.vm as any).showError(), wrapper, ".error");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The target has been showing from the beginning");
    });

    it("returns false if the target is never shown", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      const result = toShow(() => "do not anything", wrapper, ".error");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The action doesn't show the target");
    });
  });

  describe("actual use", () => {
    it("doesn't claim on correct expectation", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      expect(() => (wrapper.vm as any).showError()).toShow(wrapper, ".error");
    });

    it("doesn't claim on incorrect expectation: shown -> *", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      expect(() => (wrapper.vm as any).showError()).not.toShow(wrapper, ".error");
    });

    it("doesn't claim on incorrect expectation: hidden -> hidden", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      expect(() => "don't do nothing").not.toShow(wrapper, ".error");
    });
  });
});

describe("toHide", () => {
  describe("as a function which is registered to jest", () => {
    it("returns true if the target is hidden by specified action", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      const result = toHide(() => (wrapper.vm as any).hideError(), wrapper, ".error");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe("The action hides the target");
    });

    it("returns false if the target is hidden from the beginning", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      const result = toHide(() => (wrapper.vm as any).hideError(), wrapper, ".error");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The target has been hiding from the beginning");
    });

    it("returns false if the target is never hidden", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      const result = toHide(() => "do not anything", wrapper, ".error");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The action doesn't hide the target");
    });
  });

  describe("actual use", () => {
    it("doesn't claim on correct expectation", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      expect(() => (wrapper.vm as any).hideError()).toHide(wrapper, ".error");
    });

    it("doesn't claim on incorrect expectation: hidden -> *", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      expect(() => (wrapper.vm as any).showError()).not.toHide(wrapper, ".error");
    });

    it("doesn't claim on incorrect expectation: shown -> shown", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      expect(() => "don't do nothing").not.toHide(wrapper, ".error");
    });
  });
});
