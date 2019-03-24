import Vue from "vue";
import { MatcherComponent, MatcherComponentOptions } from "../";
import { getWarningsByMount, MatcherResult } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R> {
       /**
       * Asserts that the component accepts the value with custom validator for the prop
       * @param {string} prop - The prop's name
       * @param {any} sampleValue - The value you give for the prop
       * @param options - Mount Option of the component
       * @example
       * expect(AComponent).toBeValidPropWithCustomValidator("color", "awesomeColor")
       */
      toBeValidPropWithCustomValidator (prop: string, sampleValue: any, options?: MatcherComponentOptions<Vue>): R;
    }
  }
}

export default function toBeValidPropWithCustomValidator<V extends Vue> (
  received: MatcherComponent<V>,
  propName: string,
  value: any,
  dynamicMountOptions?: MatcherComponentOptions<V>
): MatcherResult {
  const propsData = {};
  propsData[propName] = value;
  const messages = getWarningsByMount(received, propsData, dynamicMountOptions);

  const found = messages.find((c) => {
    return c.find((arg: string) => arg.includes(`Invalid prop: custom validator check failed for prop "${propName}".\n`));
  });

  return {
    message: !!!found ?
      () => `'${propName}' prop is valid with '${value}'` :
      () => `'${propName}' prop is invalid with '${value}'`,
    pass: !!!found
  };
}
