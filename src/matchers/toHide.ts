import Vue from "vue";
import { DefaultProps, PropsDefinition } from 'vue/types/options';
import { Wrapper } from "@vue/test-utils";
import { isPromise } from "jest-util";

import { MatcherResult, WrapperFindArgument, findOrFindComponent } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Asserts that the action hides the specific content
       * @param wrapper - The wrapper of vue-test-utils
       * @param findAgrument - The argument for "wrapper.find" to find the specific content or component
       * @example
       * expect(() => somethingResolvesError()).toHide(wrapper, "p.error")
       * expect(async () => somethingResolvesErrorAsync()).toHide(wrapper, "p.error")
       */
      toHide (wrapper: Wrapper<Vue>, findAgrument: WrapperFindArgument<Vue | null>): R;
    }
  }
}

const processResult = (before: boolean, after: boolean): MatcherResult => {
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
};

export default function<V extends Vue, R extends Vue | DefaultProps | never, S extends PropsDefinition<DefaultProps> | never> (
  action: () => void | Promise<unknown>,
  wrapper: Wrapper<V>,
  findArgument: WrapperFindArgument<R, S>,
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
