import Vue from "vue";
import { Wrapper } from "@vue/test-utils";
import { MatcherResult, WrapperFindArgument } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Asserts that the action hides the specific content
       * @param wrapper - The wrapper of vue-test-utils
       * @param findAgrument - The argument for "wrapper.find" to find the specific content or component
       * @example
       * expect(() => somethingResolvesError()).toHide(wrapper, "p.error")
       */
      toHide (wrapper: Wrapper<Vue>, findAgrument: WrapperFindArgument<Vue>): R;
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

  if (!before) {
    message = "The target has been hiding from the beginning";
    result = false;
  } else if (after) {
    message = "The action doesn't hide the target";
    result = false;
  } else {
    message = "The action hides the target"
    result = true;
  }

  return {
    message: () => message,
    pass: result
  }
}
