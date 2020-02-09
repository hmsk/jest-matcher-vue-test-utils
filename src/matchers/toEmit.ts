import Vue from "vue";
import { Wrapper } from "@vue/test-utils";
import diff from "jest-diff";
import { isPromise } from "jest-util";
import { equals } from "expect/build/jasmineUtils";

import { MatcherResult } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R, T> {
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

type EmittedResult = ReturnType<Wrapper<any>['emitted']>;

const processResult = (before: EmittedResult, after: EmittedResult, eventName: string, payloads: any[]): MatcherResult => {
  let pass: boolean;
  let message: () => string;

  const emitted = after.slice(before.length, after.length);

  if (payloads.length > 0) {
    const matchesToPayload = (event): boolean => {
      return payloads.length === event.length &&
        payloads.every((payload, index) => equals(event[index], payload));
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
    pass = emitted.length > 0;
    message = pass ?
      () => `The function emitted the "${eventName}" event` :
      () => `The function did not emit the "${eventName}" event`;
  }

  return {
    pass,
    message
  };
}

const currentlyEmitted = (wrapper: Wrapper<Vue>, eventName: string): EmittedResult => {
  return wrapper.emitted()[eventName] ?  wrapper.emitted()[eventName].slice(0) : [];
}

export default function<V extends Vue> (
  action: () => (void | Promise<unknown>),
  wrapper: Wrapper<V>,
  eventName: string,
  ...payloads: any[]
): MatcherResult | Promise<MatcherResult> {
  const before = currentlyEmitted(wrapper, eventName);
  const trigger = action();

  const processResultAfterTrigger = (): MatcherResult => {
    const after = currentlyEmitted(wrapper, eventName);
    return processResult(before, after, eventName, payloads);
  };

  if (isPromise(trigger)) {
    return trigger.then(processResultAfterTrigger);
  } else {
    return processResultAfterTrigger();
  }
}
