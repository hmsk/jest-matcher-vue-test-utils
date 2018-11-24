import Vue from "vue";
import { Wrapper } from "@vue/test-utils";
import { MatcherResult } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Asserts that the action emits the specific content
       * @param wrapper - The wrapper of vue-test-utils
       * @param eventName - The event's name
       * @example
       * expect(() => somethingGreat()).toShow(wrapper, "p.error")
       */
      toEmit (wrapper: Wrapper<Vue>, eventName: string): R;
    }
  }
}

export default function<V extends Vue> (
  action: Function,
  wrapper: Wrapper<V>,
  eventName: string
): MatcherResult {
  const before = wrapper.emitted()[eventName] || [];
  action();
  const after = wrapper.emitted()[eventName] || [];

  let pass: boolean;
  let message: () => string;

  pass = after.length > before.length
  message = pass ?
    () => `The action emitted the "${eventName}" event` :
    () => `The action did not emit the "${eventName}" event`;

  return {
    pass,
    message
  }
}
