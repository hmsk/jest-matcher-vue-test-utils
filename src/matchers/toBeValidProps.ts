import Vue from "vue";
import { getWarningsByMount, MatcherResult, MatcherComponent, MatcherComponentOptions } from "../utils";

interface ComponentProp {
  [name: string]: any;
}

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Asserts that the component accepts the set of props
       * @param {any} props - The set of props
       * @param options - Mount Option of the component
       * @example
       * expect(AComponent).toBeValidProps({ type: "the type", color: "cool one"})
       */
      toBeValidProps (props: ComponentProp, options?: MatcherComponentOptions<Vue>): R;
    }
  }
}

export default function toBeValidProps<V extends Vue> (
  received: MatcherComponent<V>,
  props: ComponentProp,
  dynamicMountOptions?: MatcherComponentOptions<V>
): MatcherResult {
  const messages = getWarningsByMount(received, props, dynamicMountOptions);

  return {
    message: messages.length == 0 ?
      () => `Props are valid` :
      () => `Props are not valid`,
    pass: messages.length == 0
  };
}
