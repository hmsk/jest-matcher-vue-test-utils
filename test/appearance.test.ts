import {
  toShow,
  toHide,
  config
} from "@/index";

import Component from "./fixtures/error-message.vue";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import { MatcherResult } from '@/utils';

expect.extend({
  toShow,
  toHide
});

config({
  mountOptions: { localVue: createLocalVue() }
});

describe("toShow", () => {
  describe("as a function which is registered to jest", () => {
    it("returns true if the target is shown by specified action", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      const result = await toShow(async () => {
        (wrapper.vm as any).showError();
        await wrapper.vm.$nextTick();
      }, wrapper, ".error");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe("The action shows the target");
    });

    it("returns false if ther target is shown from the beginning", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      const result = await toShow(async () => {
        (wrapper.vm as any).showError();
        await wrapper.vm.$nextTick();
      }, wrapper, ".error");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The target has been showing from the beginning");
    });

    it("returns false if the target is never shown", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      const result = await toShow(async () => {
        // Don't do nothing
        await wrapper.vm.$nextTick();
      }, wrapper, ".error");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The action doesn't show the target");
    });

    it("returns false synchronously before nextTick", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      // Doesn't wait for nextTick with synchronous expectation, "pass: true" in older than @vue/test-utils@beta.30
      const result = toShow(() => {
        (wrapper.vm as any).showError();
      }, wrapper, ".error") as MatcherResult;
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The action doesn't show the target");
    });
  });

  describe("actual use", () => {
    it("doesn't complain about the correct expectation", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      return expect(async () => {
        (wrapper.vm as any).showError();
        await wrapper.vm.$nextTick();
      }).toShow(wrapper, ".error");
    });

    it("doesn't complain about the correct negative expectation: shown -> *", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      return expect(async () => {
        (wrapper.vm as any).showError();
        await wrapper.vm.$nextTick();
      }).not.toShow(wrapper, ".error");
    });

    it("doesn't complain about the correct negative expectation: hidden -> hidden", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      return expect(async () => {
        // Don't do nothing
        await wrapper.vm.$nextTick();
      }).not.toShow(wrapper, ".error");
    });

    it("doesn't complain about the correct negative expectation synchronously", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      // Doesn't wait for nextTick with synchronous expectation, toShow passes in older than @vue/test-utils@beta.30
      expect(() => {
        (wrapper.vm as any).showError();
      }).not.toShow(wrapper, ".error");
    });
  });
});

describe("toHide", () => {
  describe("as a function which is registered to jest", () => {
    it("returns true if the target is hidden by specified action", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      const result = await toHide(async () => {
        (wrapper.vm as any).hideError();
        await wrapper.vm.$nextTick();
      }, wrapper, ".error");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe("The action hides the target");
    });

    it("returns false if the target is hidden from the beginning", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      const result = await toHide(async () => {
        (wrapper.vm as any).hideError();
        await wrapper.vm.$nextTick();
      }, wrapper, ".error");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The target has been hiding from the beginning");
    });

    it("returns false if the target is never hidden", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      const result = await toHide(async () => {
        // Don't do nothing
        await wrapper.vm.$nextTick();
      }, wrapper, ".error");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The action doesn't hide the target");
    });

    it("returns false synchronously before nextTick", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      // Doesn't wait for nextTick with synchronous expectation, Passes from @vue/test-utils@beta.30
      const result = toHide(() => {
        (wrapper.vm as any).hideError();
      }, wrapper, ".error") as MatcherResult;
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The action doesn't hide the target");
    });
  });

  describe("actual use", () => {
    it("doesn't claim about the correct expectation", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      return expect(async () => {
        (wrapper.vm as any).hideError();
        await wrapper.vm.$nextTick();
      }).toHide(wrapper, ".error");
    });

    it("doesn't complain about the correct negative expectation: hidden -> *", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      return expect(async () => {
        (wrapper.vm as any).showError();
        await wrapper.vm.$nextTick();
      }).not.toHide(wrapper, ".error");
    });

    it("doesn't complain about the correct negative expectation: shown -> shown", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      return expect(async () => {
        // Don't do nothing
        wrapper.vm.$nextTick();
      }).not.toHide(wrapper, ".error");
    });

    it("doesn't complain about the correct negative expectation synchronously", () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      // Doesn't wait for nextTick with synchronous expectation, Passes from @vue/test-utils@beta.30
      expect(() => {
        (wrapper.vm as any).hideError();
      }).not.toHide(wrapper, ".error");
    });
  });
});
