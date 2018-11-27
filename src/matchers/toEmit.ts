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
       * @param payload - The payload of the event (optional)
       * @example
       * expect(() => somethingGreat()).toShow(wrapper, "p.error")
       */
      toEmit (wrapper: Wrapper<Vue>, eventName: string, payload?: any): R;
    }
  }
}

export default function<V extends Vue> (
  action: Function,
  wrapper: Wrapper<V>,
  eventName: string,
  payload?: any
): MatcherResult {
  const before = wrapper.emitted()[eventName] ?  wrapper.emitted()[eventName].slice(0) : [];
  action();
  const after = wrapper.emitted()[eventName] ?  wrapper.emitted()[eventName].slice(0) : [];

  let pass: boolean;
  let message: () => string;

  const matchesToPayload = (event) => (this as jest.MatcherUtils).equals(event[0], payload);

  if (arguments.length == 4) {
    pass = after.filter(matchesToPayload).length > before.filter(matchesToPayload).length;
    message = pass ?
      () => `The action emitted the "${eventName}" event with the expected payload` :
        after.length > before.length ?
          () => `The action emitted the "${eventName}" event, but the payload is not matched` :
          () => `The action did not emit the "${eventName}" event`;
  } else {
    pass = after.length > before.length
    message = pass ?
      () => `The action emitted the "${eventName}" event` :
      () => `The action did not emit the "${eventName}" event`;
  }

  return {
    pass,
    message
  };
}
