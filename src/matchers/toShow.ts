import Vue from "vue";
import { DefaultProps, PropsDefinition } from 'vue/types/options';
import { Wrapper } from "@vue/test-utils";
import { isPromise } from "jest-util";

import { MatcherResult, WrapperFindArgument, findOrFindComponent } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Asserts that the action shows the specific content
       * @param wrapper - The wrapper of vue-test-utils
       * @param findAgrument - The argument for "wrapper.find" to find the specific element or component
       * @example
       * expect(() => somethingMakesError()).toShow(wrapper, "p.error")
       * expect(async () => somethingMakesErrorAsync()).toShow(wrapper, "p.error")
       */
      toShow (wrapper: Wrapper<Vue>, findArgument: WrapperFindArgument<Vue | null>): R;

      /**
       * Asserts that the asynchronous action shows the specific content in the next tick
       * @param wrapper - The wrapper of vue-test-utils
       * @param findAgrument - The argument for "wrapper.find" to find the specific element or component
       * @example
       * expect(async () => somethingMakesErrorAsync()).toShowInNextTick(wrapper, "p.error")
       */
      toShowInNextTick (wrapper: Wrapper<Vue>, findArgument: WrapperFindArgument<Vue | null>): R;
    }
  }
}

const processResult = (before: boolean, after: boolean): MatcherResult => {
  let message: string;
  let result: boolean;

  if (before) {
    message = "The target has been showing from the beginning";
    result = false;
  } else if (!after) {
    message = "The action doesn't show the target";
    result = false;
  } else {
    message = "The action shows the target";
    result = true;
  }

  return {
    message: () => message,
    pass: result
  }
};

export function toShow <V extends Vue, R extends Vue | DefaultProps | never, S extends PropsDefinition<DefaultProps> | never> (
  action: () => void | Promise<unknown>,
  wrapper: Wrapper<V>,
  findArgument: WrapperFindArgument<R, S>
): MatcherResult | Promise<MatcherResult> {
  const before = findOrFindComponent(wrapper, findArgument).exists();

  const processResultAfterTrigger = (): MatcherResult => {
    return processResult(before, findOrFindComponent(wrapper, findArgument).exists());
  };

  const trigger = action();
  if (isPromise(trigger)) {
    return trigger.then(processResultAfterTrigger);
  } else {
    return processResultAfterTrigger();
  }
}

export function toShowInNextTick <V extends Vue, R extends Vue | DefaultProps | never, S extends PropsDefinition<DefaultProps> | never> (
  action: () => Promise<unknown>,
  wrapper: Wrapper<V>,
  findArgument: WrapperFindArgument<R, S>
): MatcherResult | Promise<MatcherResult> {
  const wrappedAction = () => new Promise((resolve) => {
    action();
    wrapper.vm.$nextTick(() => { resolve(null); });
  });
  return toShow(wrappedAction, wrapper, findArgument);
}
