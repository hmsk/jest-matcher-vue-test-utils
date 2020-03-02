import Vue from "vue";
import { isPromise } from "jest-util";
import { Wrapper } from "@vue/test-utils";
import diff from "jest-diff";
import { equals } from "expect/build/jasmineUtils";

import { MatcherResult } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Asserts that the function dispatch the Vuex action
       * @param wrapper - The wrapper of vue-test-utils
       * @param actionType - The type of store's action
       * @param payload - The payload for the action (optional)
       * @example
       * expect(() => somethingGreat()).toDispatch(wrapper, "namespace/actionType")
       * expect(async () => somethingGreatAsync()).toDispatch(wrapper, "namespace/actionType")
       */
      toDispatch (wrapper: Wrapper<Vue>, actionType: string, payload?: any): R;
    }
  }
}

export default function<V extends Vue> (
  action: () => (void | Promise<unknown>),
  wrapper: Wrapper<V>,
  actionType: string,
  payload?: any
): MatcherResult | Promise<MatcherResult> {
  let pass: boolean = false;
  let message: string = `The function never dispatched the "${actionType}" type on Vuex Store`;
  let unsubscribe = () => {};

  if (wrapper.vm.$store === undefined) {
    message = "The Vue instance doesn't have Vuex store";
  } else {
    unsubscribe = wrapper.vm.$store.subscribeAction((action, _state) => {
      if (!pass && action.type === actionType) {
        if (payload) {
          if (equals(action.payload, payload)) {
            pass = true;
            message = `The function dispatched the "${actionType}" type on Vuex Store`;
          } else {
            // TODO: Show diff for all dispatched payloads
            message = `The function dispatched the "${actionType}" type but the payload is not matched on Vuex Store\n${diff(payload, action.payload, { bAnnotation: "Dispatched" })}`;
          }
        } else {
          pass = true;
          message = `The function dispatched the "${actionType}" type on Vuex Store`;
        }
      }
    });
  }

  const trigger = action();

  if (isPromise(trigger)) {
    return trigger.then(() => {
      unsubscribe();
      return {
        pass,
        message: () => message
      };
    });
  } else {
    unsubscribe();
    return {
      pass,
      message: () => message
    };
  }
}
