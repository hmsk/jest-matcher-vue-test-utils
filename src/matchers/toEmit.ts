import Vue from "vue";
import { createWrapper, Wrapper } from "@vue/test-utils";
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
       * expect(async () => somethingGreatAsync()).toEmit(wrapper, "greatEvent", "crazyPayload", ["more"], "arguments")
       */
      toEmit (wrapper: Wrapper<Vue>, eventName: string, ...payloads: any[]): R;

      /**
       * Asserts that the function emits the specific event and payload on $root
       * @param wrapper - The wrapper of vue-test-utils
       * @param eventName - The event's name
       * @param payload - The payload of the event (optional)
       * @example
       * expect(() => somethingGreat()).toEmitOnRoot(wrapper, "greatEvent")
       * expect(() => somethingGreat()).toEmitOnRoot(wrapper, "greatEvent", "crazyPayload")
       * expect(() => somethingGreat()).toEmitOnRoot(wrapper, "greatEvent", "crazyPayload", ["more"], "arguments")
       * expect(async () => somethingGreatAsync()).toEmitOnRoot(wrapper, "greatEvent", "crazyPayload", ["more"], "arguments")
       */
      toEmitOnRoot (wrapper: Wrapper<Vue>, eventName: string, ...payloads: any[]): R;
    }

  }
}

type EmittedResult = ReturnType<Wrapper<any>['emitted']>;

const processResult = (before: EmittedResult, after: EmittedResult, eventName: string, isRoot: boolean, payloads: any[]): MatcherResult => {
  let pass: boolean;
  let message: () => string;

  const beforeLength = before?.length ?? 0;
  const afterLength = after?.length ?? 0;
  const emitted = after?.slice(beforeLength, afterLength) ?? [];

  const onRootSuffix = isRoot ? " on $root" : "";

  if (payloads.length > 0) {
    const matchesToPayload = (event): boolean => {
      return payloads.length === event.length &&
        payloads.every((payload, index) => equals(event[index], payload));
    };
    pass = emitted.filter(matchesToPayload).length > 0;
    message = pass ?
      () => `The function emitted the "${eventName}" event${onRootSuffix} with the expected payload` :
        emitted.length > 0 ?
          () => {
            const diffs = emitted.map((event, i): string | null => {
              return `'${eventName}' event #${i} payloads:\n\n${diff(payloads, event, { bAnnotation: "Emitted" })}`;
            }).join("\n\n");
            return `The function emitted the "${eventName}" event${onRootSuffix}, but the payload is not matched\n\n${diffs}`
          } :
          () => `The function did not emit the "${eventName}" event${onRootSuffix}`;
  } else {
    pass = emitted.length > 0;
    message = pass ?
      () => `The function emitted the "${eventName}" event${onRootSuffix}` :
      () => `The function did not emit the "${eventName}" event${onRootSuffix}`;
  }

  return {
    pass,
    message
  };
}

const currentlyEmitted = (wrapper: Wrapper<Vue>, eventName: string): EmittedResult => {
  return wrapper.emitted()[eventName]?.slice(0) ?? [];
}

export function toEmit <V extends Vue> (
  action: () => (void | Promise<unknown>),
  wrapper: Wrapper<V>,
  eventName: string,
  ...payloads: any[]
): MatcherResult | Promise<MatcherResult> {
  const before = currentlyEmitted(wrapper, eventName);
  const trigger = action();

  const processResultAfterTrigger = (): MatcherResult => {
    const after = currentlyEmitted(wrapper, eventName);
    const isRoot = wrapper.vm === wrapper.vm.$root;
    return processResult(before, after, eventName, isRoot, payloads);
  };

  if (isPromise(trigger)) {
    return trigger.then(processResultAfterTrigger);
  } else {
    return processResultAfterTrigger();
  }
}

export function toEmitOnRoot <V extends Vue> (
  action: () => (void | Promise<unknown>),
  wrapper: Wrapper<V>,
  eventName: string,
  ...payloads: any[]
): MatcherResult | Promise<MatcherResult> {
  const rootWrapper = createWrapper(wrapper.vm.$root);
  return toEmit(action, rootWrapper, eventName, ...payloads);
}
