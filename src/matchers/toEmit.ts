import Vue from "vue";
import { Wrapper } from "@vue/test-utils";
import diff from "jest-diff";
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
  const emitted = after.slice(before.length, after.length);

  let pass: boolean;
  let message: () => string;

  if (arguments.length >= 4) {
    const matchesToPayload = (event): boolean => {
      return payloads.length === event.length &&
        payloads.every((payload, index) => {
          return (this as jest.MatcherUtils).equals(event[index], payload);
        });
    };
    pass = emitted.filter(matchesToPayload).length > 0;
    message = pass ?
      () => `The function emitted the "${eventName}" event with the expected payload` :
        emitted.length > 0 ?
          () => {
            const diffs = emitted.map((event, i): string | null => {
              return `'${eventName}' event #${i} payloads:\n\n${diff(payloads, event, { bAnnotation: "Emitted" })}`;
            }).join("\n\n");
            return `The function emitted the "${eventName}" event, but the payload is not matched\n\n${diffs}`
          } :
          () => `The function did not emit the "${eventName}" event`;
  } else {
    pass = emitted.length > 0
    message = pass ?
      () => `The function emitted the "${eventName}" event` :
      () => `The function did not emit the "${eventName}" event`;
  }

  return {
    pass,
    message
  };
}
