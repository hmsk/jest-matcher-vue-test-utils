import Vue from "vue";
import { Wrapper } from "@vue/test-utils";
import { MatcherResult } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Asserts that the function emits the specific event and payload
       * @param wrapper - The wrapper of vue-test-utils
       * @param eventName - The event's name
       * @param payload - The payload of the event (optional)
       * @example
       * expect(() => somethingGreat()).toEmit(wrapper, "greatEvent")
       * expect(() => somethingGreat()).toEmit(wrapper, "greatEvent", "crazyPayload")
       * expect(() => somethingGreat()).toEmit(wrapper, "greatEvent", "crazyPayload", ["more"], "arguments")
       */
      toEmit (wrapper: Wrapper<Vue>, eventName: string, ...payloads: any[]): R;
    }
  }
}

export default function<V extends Vue> (
  func: Function,
  wrapper: Wrapper<V>,
  eventName: string,
  ...payloads: any[]
): MatcherResult {
  const before = wrapper.emitted()[eventName] ?  wrapper.emitted()[eventName].slice(0) : [];
  func();
  const after = wrapper.emitted()[eventName] ?  wrapper.emitted()[eventName].slice(0) : [];

  let pass: boolean;
  let message: () => string;

  const matchesToPayload = (event): boolean => {
    return payloads.length === event.length &&
      payloads.every((payload, index) => {
        return (this as jest.MatcherUtils).equals(event[index], payload);
      });
  };

  if (arguments.length >= 4) {
    pass = after.filter(matchesToPayload).length > before.filter(matchesToPayload).length;
    message = pass ?
      () => `The function emitted the "${eventName}" event with the expected payload` :
        after.length > before.length ?
          () => `The function emitted the "${eventName}" event, but the payload is not matched` :
          () => `The function did not emit the "${eventName}" event`;
  } else {
    pass = after.length > before.length
    message = pass ?
      () => `The function emitted the "${eventName}" event` :
      () => `The function did not emit the "${eventName}" event`;
  }

  return {
    pass,
    message
  };
}
