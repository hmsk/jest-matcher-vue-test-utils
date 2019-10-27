import Vue from "vue";
import { Wrapper } from "@vue/test-utils";

import { MatcherResult, WrapperFindArgument } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Asserts that the action shows the specific content
       * @param wrapper - The wrapper of vue-test-utils
       * @param findAgrument - The argument for "wrapper.find" to find the specific element or component
       * @example
       * expect(() => somethingMakesError()).toShow(wrapper, "p.error")
       */
      toShow (wrapper: Wrapper<Vue>, findArgument: WrapperFindArgument<Vue>): R;
    }
  }
}

export default function<V extends Vue> (
  action: Function,
  wrapper: Wrapper<V>,
  findArgument: WrapperFindArgument<V>
): MatcherResult {
  const before = wrapper.contains(findArgument);
  action();
  const after = wrapper.contains(findArgument);

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
}
