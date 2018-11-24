import Vue from "vue";
import { Wrapper } from "@vue/test-utils";
import { MatcherResult } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Asserts that the action shows the specific content
       * @param {string} eventName - The event's name
       * @param payload - The payload of the event
       * @example
       * expect(wrapper).toBeEmittedWith("input", "expected new value")
       */
      toBeEmittedWith (eventName: string, payload: any): R;
    }
  }
}

export default function toBeEmittedWith<V extends Vue> (
  wrapper: Wrapper<V>,
  eventName: string,
  payload: any
): MatcherResult {
  const emitted = wrapper.emitted()[eventName] || [];

  const pass = emitted.some((event) => {
    return (this as jest.MatcherUtils).equals(event[0], payload)
  });

  return {
    message: pass ?
      () => `The "${eventName}" event was emitted with the expected payload` :
        emitted.length > 0 ?
          () => `The "${eventName}" event was emitted but the payload is not matched` :
          () => `The "${eventName}" event was never emitted`,
    pass
  }
}
