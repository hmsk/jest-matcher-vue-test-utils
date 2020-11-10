import Vue from "vue";
import { createWrapper, Wrapper } from "@vue/test-utils";
import diff from "jest-diff";
import { equals } from "expect/build/jasmineUtils";

import { MatcherResult } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Asserts that the emitted event with payload
       * @param {string} eventName - The event's name
       * @param payload - The payload of the event (optional)
       * @example
       * expect(wrapper).toHaveEmitted("input")
       * expect(wrapper).toHaveEmitted("input", "value")
       * expect(wrapper).toHaveEmitted("input", "value", ["more"], "arguments")
       */
      toHaveEmitted (eventName: string, ...payloads: any[]): R;

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

export function toHaveEmitted <V extends Vue> (
  wrapper: Wrapper<V>,
  eventName: string,
  ...payloads: any[]
): MatcherResult {
  const emitted = wrapper.emitted()[eventName] || [];

  let pass: boolean;
  let message: () => string;

  const onRootSuffix = wrapper.vm === wrapper.vm.$root ? " on $root" : "";

  if (arguments.length >= 3) {
    pass = emitted.some((event) => {
      return payloads.length === event.length &&
        payloads.every((payload, index) => {
          return equals(event[index], payload);
        });
    });
    message = pass ?
      () => `The "${eventName}" event was emitted${onRootSuffix} with the expected payload` :
        emitted.length > 0 ?
          () => {
            const diffs = emitted.map((event, i): string | null => {
              return `'${eventName}' event #${i} payloads:\n\n${diff(payloads, event, { bAnnotation: "Emitted" })}`;
            }).join("\n\n");
            return `The "${eventName}" event was emitted${onRootSuffix} but the payload is not matched\n\n${diffs}`
          } :
          () => `The "${eventName}" event was never emitted${onRootSuffix}`;
  } else {
    pass = emitted.length > 0;
    message = pass ?
      () => `The "${eventName}" event was emitted${onRootSuffix}` :
      () => `The "${eventName}" event was never emitted${onRootSuffix}`;
  }

  return {
    message,
    pass
  }
}

export function toHaveEmittedOnRoot <V extends Vue> (
  wrapper: Wrapper<V>,
  eventName: string,
  ...payloads: any[]
): MatcherResult {
  const rootWrapper = createWrapper(wrapper.vm.$root);
  return toHaveEmitted(rootWrapper, eventName, ...payloads);
}
