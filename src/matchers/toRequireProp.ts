import Vue from "vue";
import { getWarningsByMount, MatcherResult, MatcherComponent, MatcherComponentOptions } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Asserts that the component requires the prop
       * @param {string} prop - The prop's name
       * @param options - Mount Option of the component
       * @example
       * expect(AComponent).toRequireProp("type")
       */
      toRequireProp (prop: string, options?: MatcherComponentOptions<Vue>): R;
    }
  }
}

export default function toRequireProp<V extends Vue> (
  received: MatcherComponent<V>,
  propName: string,
  dynamicMountOptions?: MatcherComponentOptions<V>
): MatcherResult {
  const messages = getWarningsByMount(received, {}, dynamicMountOptions);

  const found = messages.find((c) => {
    return c.find((arg: string) => arg.includes(`Missing required prop: "${propName}"\n`))
  });

  return {
    message: !!found ?
      () => `'${propName}' prop is claimed as required` :
      () => `'${propName}' prop is not claimed as required`,
    pass: !!found
  };
}
