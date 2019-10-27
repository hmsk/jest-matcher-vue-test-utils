import Vue from "vue";
import { getWarningsByMount, MatcherResult, MatcherComponent, MatcherComponentOptions } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Asserts that the component accepts the value for the single prop
       * @param {string} prop - The prop's name
       * @param {any} sampleValue - The value you give for the prop
       * @param options - Mount Option of the component
       * @example
       * expect(AComponent).toBeValidProp("type", "hope this value accepts")
       */
      toBeValidProp (prop: string, sampleValue: any, options?: MatcherComponentOptions<Vue>): R;
    }
  }
}

export default function toBeValidProp<V extends Vue> (
  received: MatcherComponent<V>,
  propName: string,
  value: any,
  dynamicMountOptions?: MatcherComponentOptions<V>
): MatcherResult {
  const props = {};
  props[propName] = value;
  const messages = getWarningsByMount(received, props, dynamicMountOptions);

  const found = messages.find((c) => {
    return c.find((arg: string) => {
      return arg.includes(`Invalid prop: type check failed for prop "${propName}".`) ||
        arg.includes(`Missing required prop: "${propName}"\n`) ||
        arg.includes(`Invalid prop: custom validator check failed for prop "${propName}".\n`);
    });
  });

  return {
    message: !!!found ?
      () => `'${propName}' is valid` :
      () => `'${propName}' is not valid`,
    pass: !!!found
  };
}
