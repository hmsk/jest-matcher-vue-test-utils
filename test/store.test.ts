import {
  config,
  toDispatch,
  toHaveDispatched,
  vuexPlugin
} from "@/index";

import Component from "./fixtures/store.vue";
import Vuex from "vuex";
import { createLocalVue, shallowMount } from "@vue/test-utils";

expect.extend({
  toDispatch,
  toHaveDispatched
});

config({
  mountOptions: { localVue: createLocalVue() }
});

const fakeJestContext = (expect: boolean = true) => {
  return {
    equals: (a: any, b: any) => expect
  };
};

describe("toDispatch", () => {
  const mountComponent = () => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Vuex.Store({
      actions: {
        awesomeAction() {}
      }
    });
    return shallowMount(Component, { store, localVue });
  };

  const customDispatch = (wrapper, payload) => {
    wrapper.vm.dispatchActionWithPayload(payload);
  };

  describe("as a function which is registered to jest", () => {
    it("returns true if the action type is dispatched by the function", () => {
      const wrapper = mountComponent();
      const result = toDispatch(() => wrapper.trigger("click"), wrapper, "awesomeAction");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe('The function dispatched the "awesomeAction" type on Vuex Store');
    });

    it("returns false if the action type is not dispatched by the function", () => {
      const wrapper = mountComponent();
      const result = toDispatch(() => wrapper.trigger("click"), wrapper, "notAwesomeAction");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('The function never dispatched the "notAwesomeAction" type on Vuex Store');
    });

    it("returns true if the action type with matching payload is dispatched by the function", () => {
      const wrapper = mountComponent();
      const result = toDispatch.bind(fakeJestContext(true))(() => customDispatch(wrapper, "hello"), wrapper, "awesomeAction", "hello");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe('The function dispatched the "awesomeAction" type on Vuex Store');
    });

    describe("the action is dispatched by the function, but the payload is not matched", () => {
      const subject = () => {
        const wrapper = mountComponent();
        return toDispatch.bind(fakeJestContext(false))(() => customDispatch(wrapper, "hello?"), wrapper, "awesomeAction", "hellooooo");
      };

      it("returns false", () => {
        expect(subject().pass).toBe(false);
      });

      it("message tells the reason", () => {
        expect(subject().message()).toContain('The function dispatched the "awesomeAction" type but the payload is not matched on Vuex Store');
      });

      it("message tells the reason", () => {
        const message = subject().message();
        expect(message).toContain("- Expected");
        expect(message).toContain("- hellooooo");
        expect(message).toContain("+ Dispatched");
        expect(message).toContain("+ hello?");
      });
    });

    it("returns false if the wrapper's Vue instance doesn't have Vuex Store", () => {
      const wrapper = shallowMount(Component);
      const result = toDispatch(() => {}, wrapper, "awesomeAction");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The Vue instance doesn't have Vuex store");
    });
  });

  describe("actual use", () => {
    it("passes positively when the expected action type is dispatched by the function", () => {
      const wrapper = mountComponent();
      expect(() => wrapper.trigger("click")).toDispatch(wrapper, "awesomeAction");
    });

    it("passes negatively when the expected action type is dispatched by the function", () => {
      const wrapper = mountComponent();
      expect(() => wrapper.trigger("click")).not.toDispatch(wrapper, "notAwesomeAction");
    });

    it("passes positively when the expected action type with paylaod is dispatched by the function", () => {
      const wrapper = mountComponent();
      expect(() => customDispatch(wrapper, "hello")).toDispatch(wrapper, "awesomeAction", "hello");
    });

    it("passes negatively when the expected action type is emitted by the function, but the payload is not matched", () => {
      const wrapper = mountComponent();
      expect(() => customDispatch(wrapper, "hello")).not.toDispatch(wrapper, "awesomeAction", "helloooooo");
    });
  });
});

describe("toHaveDispatched", () => {
  const mountComponent = () => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Vuex.Store({
      actions: {
        awesomeAction() {}
      },
      plugins: [vuexPlugin()]
    });
    return shallowMount(Component, { store, localVue });
  };

  const customDispatch = (wrapper, payload) => {
    wrapper.vm.dispatchActionWithPayload(payload);
  };

  describe("as a function which is registered to jest", () => {
    it("returns true if the action type has been dispatched", () => {
      const wrapper = mountComponent();
      wrapper.trigger("click")
      const result = toHaveDispatched(wrapper, "awesomeAction");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe('"awesomeAction" action has been dispatched');
    });

    it("returns false if the action type has never been dispatched", () => {
      const wrapper = mountComponent();
      wrapper.trigger("click")
      const result = toHaveDispatched(wrapper, "notAwesomeAction");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('"notAwesomeAction" action has never been dispatched');
    });

    it("returns true if the action type with matching payload has been dispatched", () => {
      const wrapper = mountComponent();
      customDispatch(wrapper, "hello")
      const result = toHaveDispatched.bind(fakeJestContext(true))(wrapper, "awesomeAction", "hello");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe('"awesomeAction" action has been dispatched with expected payload');
    });

    it("returns false if the action type has been dispatched, but payload is not matched", () => {
      const wrapper = mountComponent();
      customDispatch(wrapper, "hello")
      const result = toHaveDispatched.bind(fakeJestContext(false))(wrapper, "awesomeAction", "hello");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('"awesomeAction" action has been dispatched, but payload isn\'t matched to the expectation');
    });

    it("returns false if the wrapper's Vue instance doesn't have Vuex Store", () => {
      const wrapper = shallowMount(Component);
      const result = toHaveDispatched(wrapper, "awesomeAction");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The Vue instance doesn't have Vuex store");
    });

    it("returns false if the Vuex Store doesn't have plugin we provide", () => {
      const localVue = createLocalVue();
      localVue.use(Vuex);
      const store = new Vuex.Store({
        actions: {
          awesomeAction() {}
        }
      });

      const wrapper = shallowMount(Component, { store, localVue });
      const result = toHaveDispatched(wrapper, "awesomeAction");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe("The Vuex Store doesn't have the plugin by jest-matcher-vue-test-utils");
    });
  });

  describe("actual use", () => {
    it("passes positively when the expected action type is dispatched", () => {
      const wrapper = mountComponent();
      wrapper.trigger("click")
      expect(wrapper).toHaveDispatched("awesomeAction");
    });

    it("passes negatively when the expected action type is dispatched", () => {
      const wrapper = mountComponent();
      wrapper.trigger("click")
      expect(wrapper).not.toHaveDispatched("notAwesomeAction");
    });

    it("passes positively when the expected action type with paylaod is dispatched", () => {
      const wrapper = mountComponent();
      customDispatch(wrapper, "hello");
      expect(wrapper).toHaveDispatched("awesomeAction", "hello");
    });

    it("passes negatively when the expected action type is emitted by the function, but the payload is not matched", () => {
      const wrapper = mountComponent();
      customDispatch(wrapper, "hello")
      expect(wrapper).not.toHaveDispatched("awesomeAction", "helloooooo");
    });
  });
});
