import Vue from "vue";
import { Wrapper } from "@vue/test-utils";
import { MatcherResult } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Asserts that the function dispatch the Vuex action
       * @param wrapper - The wrapper of vue-test-utils
       * @param actionType - The type of store's action
       * @param payload - The payload for the action (optional)
       * @example
       * expect(() => somethingGreat()).toDispatch(wrapper, "namespace/actionType")
       */
      toDispatch (wrapper: Wrapper<Vue>, actionType: string, payload?: any): R;
    }
  }
}

export default function<V extends Vue> (
  fun: Function,
  wrapper: Wrapper<V>,
  actionType: string,
  payload?: any
): MatcherResult {
  let pass: boolean = false;
  let message: string = `The function never dispatched the "${actionType}" type on Vuex Store`;
  let unsubscribe = () => {};

  if (wrapper.vm.$store === undefined) {
    message = "The Vue instance doesn't have Vuex store";
  } else {
    unsubscribe = wrapper.vm.$store.subscribeAction((action, _state) => {
      if (!pass && action.type === actionType) {
        if (payload) {
          if ((this as jest.MatcherUtils).equals(action.payload, payload)) {
            pass = true;
            message = `The function dispatched the "${actionType}" type on Vuex Store`;
          } else {
            message = `The function dispatched the "${actionType}" type but the payload is not matched on Vuex Store`;
          }
        } else {
          pass = true;
          message = `The function dispatched the "${actionType}" type on Vuex Store`;
        }
      }
    });
  }

  fun();
  unsubscribe();

  return {
    pass,
    message: () => message
  };
}
