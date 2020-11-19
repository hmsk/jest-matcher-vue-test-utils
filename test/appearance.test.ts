import {
  toShow,
  toShowInNextTick,
  toHide,
  toHideInNextTick,
  config
} from "@/index";

import Component from "./fixtures/error-message.vue";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import { MatcherResult } from '@/utils';

expect.extend({
  toShow,
  toShowInNextTick,
  toHide,
  toHideInNextTick
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
      }, wrapper, ".error");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe("The action shows the target");
    });

    it("returns false if ther target is shown from the beginning", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      const result = await toShow(async () => {
        (wrapper.vm as any).showError();
      }, wrapper, ".error");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The target has been showing from the beginning");
    });

    it("returns false if the target is never shown", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      const result = await toShow(async () => {
        // Don't do nothing
      }, wrapper, ".error");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The action doesn't show the target");
    });

    describe("for asynchronous action", () => {
      it("returns false if the target will be shown in the next tick", async () => {
        const wrapper = shallowMount(Component, { propsData: { initialError: false }});
        const result = await toShow(async () => {
          (wrapper.vm as any).showErrorAsync();
        }, wrapper, ".error");
        expect(result.pass).toBe(false);
        expect(result.message()).toBe("The action doesn't show the target");
      });

      it("toShowInNextTick returns true if the target will be shown in the next tick", async () => {
        const wrapper = shallowMount(Component, { propsData: { initialError: false }});
        const result = await toShowInNextTick(async () => {
          (wrapper.vm as any).showErrorAsync();
        }, wrapper, ".error");
        expect(result.pass).toBe(true);
        expect(result.message()).toBe("The action shows the target");
      });
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
      }).toShow(wrapper, ".error");
    });

    it("doesn't complain about the correct negative expectation: shown -> *", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: true }});
      return expect(async () => {
        (wrapper.vm as any).showError();
      }).not.toShow(wrapper, ".error");
    });

    it("doesn't complain about the correct negative expectation: hidden -> hidden", async () => {
      const wrapper = shallowMount(Component, { propsData: { initialError: false }});
      return expect(async () => {
        // Don't do nothing
      }).not.toShow(wrapper, ".error");
    });

    describe("for asynchronous action", () => {
      it("doesn't complain about the correct negative expectation: hidden -> not yet shown (asynchronously shown)", async () => {
        const wrapper = shallowMount(Component, { propsData: { initialError: false }});
        return expect(async () => {
          (wrapper.vm as any).showErrorAsync();
        }).not.toShow(wrapper, ".error");
      });

      it("toShowInNextTick doesn't complain about the correct expectation: hidden -> not yet shown (asynchronously shown)", async () => {
        const wrapper = shallowMount(Component, { propsData: { initialError: false }});
        return expect(async () => {
          (wrapper.vm as any).showErrorAsync();
        }).toShowInNextTick(wrapper, ".error");
      });
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

    describe("for asynchronous action", () => {
      it("returns false if the target is hidden in the next tick", async () => {
        const wrapper = shallowMount(Component, { propsData: { initialError: true }});
        const result = await toHide(async () => {
          (wrapper.vm as any).hideErrorAsync();
        }, wrapper, ".error");
        expect(result.pass).toBe(false);
        expect(result.message()).toBe("The action doesn't hide the target");
      });

      it("toHideInNextTick returns true if the target is hidden in the next tick", async () => {
        const wrapper = shallowMount(Component, { propsData: { initialError: true }});
        const result = await toHideInNextTick(async () => {
          (wrapper.vm as any).hideErrorAsync();
        }, wrapper, ".error");
        expect(result.pass).toBe(true);
        expect(result.message()).toBe("The action hides the target");
      });
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

    describe("for asynchronous action", () => {
      it("doesn't complain about the correct negative expectation: shown -> hidden (asynchronously hidden)", async () => {
        const wrapper = shallowMount(Component, { propsData: { initialError: true }});
        return expect(async () => {
          (wrapper.vm as any).hideErrorAsync();
        }).not.toHide(wrapper, ".error");
      });

      it("toHideInNextTick doesn't complain about the correct expectation: shown -> not yet hidden (asynchronously hidden)", async () => {
        const wrapper = shallowMount(Component, { propsData: { initialError: true }});
        return expect(async () => {
          (wrapper.vm as any).hideErrorAsync();
        }).toHideInNextTick(wrapper, ".error");
      });
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
