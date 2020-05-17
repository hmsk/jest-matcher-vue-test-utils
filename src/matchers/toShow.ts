import Vue from "vue";
import { Wrapper } from "@vue/test-utils";
import { isPromise } from "jest-util";

import { MatcherResult, VueTestUtilsFindArgument } from "../utils";

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
      toShow (wrapper: Wrapper<Vue>, findArgument: VueTestUtilsFindArgument): R;
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

export default function<V extends Vue> (
  action: () => void | Promise<unknown>,
  wrapper: Wrapper<V>,
  findArgument: VueTestUtilsFindArgument
): MatcherResult | Promise<MatcherResult> {
  // @ts-ignore: The typedef on @vue/test-utils is wrong
  const before = wrapper.find(findArgument).exists();

  const processResultAfterTrigger = (): MatcherResult => {
    // @ts-ignore: The typedef on @vue/test-utils is wrong
    return processResult(before, wrapper.find(findArgument).exists());
  };

  const trigger = action();
  if (isPromise(trigger)) {
    return trigger.then(processResultAfterTrigger);
  } else {
    return processResultAfterTrigger();
  }
}
