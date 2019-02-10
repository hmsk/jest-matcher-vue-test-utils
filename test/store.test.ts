import {
  config,
  toDispatch,
} from "@/index";

import Component from "./fixtures/store.vue";
import Vuex from "vuex";
import { createLocalVue, shallowMount } from "@vue/test-utils";

expect.extend({
  toDispatch
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

    it("returns false if the action is dispatched by the function, but payload is not matched", () => {
      const wrapper = mountComponent();
      const result = toDispatch.bind(fakeJestContext(false))(() => customDispatch(wrapper, "hello"), wrapper, "awesomeAction", "hellooooo");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('The function dispatched the "awesomeAction" type but the payload is not matched on Vuex Store');
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
