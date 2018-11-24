import Vue from "vue";
import { Wrapper } from "@vue/test-utils";
import { MatcherResult } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Asserts that the event is emitted
       * @param {string} eventName - The event's name
       * @example
       * expect(wrapper).toBeEmitted("input")
       */
      toBeEmitted (eventName: string): R;

      /**
       * Asserts that the event is emitted
       * @param {string} eventName - The event's name
       * @example
       * expect(wrapper).toHaveBeenEmitted("input")
       */
      toHaveBeenEmitted(eventName: string): R;
    }
  }
}

export default function<V extends Vue> (
  wrapper: Wrapper<V>,
  eventName: string
): MatcherResult {
  const emitted = wrapper.emitted()[eventName] || [];
  return {
    message: emitted.length > 0 ?
      () => `The "${eventName}" event was emitted` :
      () => `The "${eventName}" event was never emitted`,
    pass: emitted.length > 0
  }
}
