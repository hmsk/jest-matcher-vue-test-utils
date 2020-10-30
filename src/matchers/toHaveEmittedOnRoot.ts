import Vue from "vue";
import { Wrapper, createWrapper } from "@vue/test-utils";
import diff from "jest-diff";
import { equals } from "expect/build/jasmineUtils";

import { MatcherResult } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Asserts that the emitted event on $root with payload
       * @param {string} eventName - The event's name
       * @param payload - The payload of the event (optional)
       * @example
       * expect(wrapper).toHaveEmittedOnRoot("input")
       * expect(wrapper).toHaveEmittedOnRoot("input", "value")
       * expect(wrapper).toHaveEmittedOnRoot("input", "value", ["more"], "arguments")
       */
      toHaveEmittedOnRoot (eventName: string, ...payloads: any[]): R;
    }
  }
}

export default function<V extends Vue> (
  wrapper: Wrapper<V>,
  eventName: string,
  ...payloads: any[]
): MatcherResult {
  const emittedOnRoot = createWrapper(wrapper.vm.$root).emitted()[eventName] || [];

  let pass: boolean;
  let message: () => string;

  if (arguments.length >= 3) {
    pass = emittedOnRoot.some((event) => {
      return payloads.length === event.length &&
        payloads.every((payload, index) => {
          return equals(event[index], payload);
        });
    });
    message = pass ?
      () => `The "${eventName}" event was emitted on $root with the expected payload` :
        emittedOnRoot.length > 0 ?
          () => {
            const diffs = emittedOnRoot.map((event, i): string | null => {
              return `'${eventName}' event #${i} payloads:\n\n${diff(payloads, event, { bAnnotation: "Emitted" })}`;
            }).join("\n\n");
            return `The "${eventName}" event was emitted on $root but the payload is not matched\n\n${diffs}`
          } :
          () => `The "${eventName}" event was never emitted on $root`;
  } else {
    pass = emittedOnRoot.length > 0;
    message = pass ?
      () => `The "${eventName}" event was emitted on $root` :
      () => `The "${eventName}" event was never emitted on $root`;
  }

  return {
    message,
    pass
  }
}
