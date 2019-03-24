import Vue from "vue";
import { MatcherComponent, MatcherComponentOptions } from "../";
import { getWarningsByMount, MatcherResult } from "../utils";

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Asserts that the component accepts the type for the single prop
       * @param {string} prop - The prop's name
       * @param {any} type - The type (String|Number|Boolean|Array|Object|Date|Function|Symbol|[your prototype instance])
       * @param options - Mount Option of the component
       * @example
       * expect(AComponent).toBeValidPropWithTypeCheck("color", String)
       */
      toBeValidPropWithTypeCheck (prop: string, type: any | any[], options?: MatcherComponentOptions<Vue>): R;
    }
  }
}

export default function toBeValidPropWithTypeCheck<V extends Vue> (
  received: MatcherComponent<V>,
  propName: string,
  value: any,
  dynamicMountOptions?: MatcherComponentOptions<V>
): MatcherResult {
  const propsData = {};
  propsData[propName] = value;
  const messages = getWarningsByMount(received, propsData, dynamicMountOptions);

  const found = messages.find((c) => {
    return c.find((arg: string) => arg.includes(`Invalid prop: type check failed for prop "${propName}".`));
  });

  return {
    message: !!!found ?
      () => `'${propName}' prop is valid with '${value}'` :
      () => `'${propName}' prop is invalid with '${value}'`,
    pass: !!!found
  };
}
