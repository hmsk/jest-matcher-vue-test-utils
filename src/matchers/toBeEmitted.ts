import Vue from "vue";
import { Wrapper } from "@vue/test-utils";
import { MatcherResult } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Asserts that the event is emitted
       * @param {string} eventName - The event's name
       * @param payload - The payload of the event (optional)
       * @example
       * expect(wrapper).toBeEmitted("input")
       * expect(wrapper).toBeEmitted("input", "value")
       */
      toBeEmitted (eventName: string, payload?: any): R;

      /**
       * Asserts that the event is emitted
       * @param {string} eventName - The event's name
       * @param payload - The payload of the event (optional)
       * @example
       * expect(wrapper).toHaveBeenEmitted("input")
       * expect(wrapper).toHaveBeenEmitted("input", "value")
       */
      toHaveBeenEmitted(eventName: string, payload?: any): R;
    }
  }
}

export default function<V extends Vue> (
  wrapper: Wrapper<V>,
  eventName: string,
  payload?: any
): MatcherResult {
  const emitted = wrapper.emitted()[eventName] || [];

  let pass: boolean;
  let message: () => string;

  if (arguments.length == 3) {
    pass = emitted.some((event) => {
      return (this as jest.MatcherUtils).equals(event[0], payload)
    });
    message = pass ?
      () => `The "${eventName}" event was emitted with the expected payload` :
        emitted.length > 0 ?
          () => `The "${eventName}" event was emitted but the payload is not matched` :
          () => `The "${eventName}" event was never emitted`;
  } else {
    pass = emitted.length > 0;
    message = pass ?
      () => `The "${eventName}" event was emitted` :
      () => `The "${eventName}" event was never emitted`;
  }

  return {
    message,
    pass
  }
}
