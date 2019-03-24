import Vue from "vue";
import { ActionPayload } from "vuex";
import { Wrapper } from "@vue/test-utils";
import { MatcherResult } from "../utils";
import { storeKey } from "../vuex-plugin";

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Asserts dispatched the Vuex action
       * @param actionType - The type of store's action
       * @param payload - The payload for the action (optional)
       * @example
       * expect(wrapper).toHaveDispatched("namespace/actionType")
       */
      toHaveDispatched (actionType: string, payload?: any): R;
    }
  }
}

export default function<V extends Vue> (
  wrapper: Wrapper<V>,
  actionType: string,
  payload?: any
): MatcherResult {
  let pass: boolean = false;
  let message: string = `"${actionType}" action has never been dispatched`;

  if (wrapper.vm.$store === undefined) {
    message = "The Vue instance doesn't have Vuex store";
  } else if (wrapper.vm.$store[storeKey] === undefined) {
    message = "The Vuex Store doesn't have the plugin by jest-matcher-vue-test-utils";
  } else {
    const dispatched: ActionPayload[] = wrapper.vm.$store[storeKey].dispatched;
    const matched = dispatched.filter((log) => log.type === actionType);

    if (matched.length > 0) {
      if (payload) {
        const matchedPayload = matched.some((log) => (this as jest.MatcherUtils).equals(log.payload, payload));
        if (matchedPayload) {
          pass = true;
          message = `"${actionType}" action has been dispatched with expected payload`;
        } else {
          message = `"${actionType}" action has been dispatched, but payload isn't matched to the expectation`;
        }
      } else {
        pass = true;
        message = `"${actionType}" action has been dispatched`;
      }
    }
  }

  return {
    pass,
    message: () => message
  };
}
