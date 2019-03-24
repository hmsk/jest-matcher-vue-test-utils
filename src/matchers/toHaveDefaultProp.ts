import Vue from "vue";
import { shallowMount } from "@vue/test-utils";
import { MatcherResult, withMockWarning, corkComponent, MatcherComponent, MatcherComponentOptions } from "../utils";
import { overwriteConfiguration, getConfiguration } from "../config";

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Asserts that the component gives default value for the prop
       * @param {string} prop - The prop's name
       * @param {any} defaultValue - The default value you're expecting for the prop
       * @param options - Mount Option of the component
       * @example
       * expect(AComponent).toHaveDefaultProp("type", "I am a default message")
       */
      toHaveDefaultProp (prop: string, defaultValue: any, options?: MatcherComponentOptions<Vue>): R;
    }
  }
}

export default function toHaveDefaultProp<V extends Vue> (
  received: MatcherComponent<V>,
  propName: string,
  defaultValue: any,
  dynamicMountOptions?: MatcherComponentOptions<V>
): MatcherResult {
  const mountOption = dynamicMountOptions ?
    overwriteConfiguration<V>({ mountOptions: dynamicMountOptions }).mountOptions :
    getConfiguration<V>().mountOptions;

  let wrapper;
  withMockWarning(() => {
    wrapper = shallowMount<V>(corkComponent(received), { ...mountOption });
  });

  const given = wrapper.props()[propName];
  const matched = (this as jest.MatcherUtils).equals(given, defaultValue);

  return {
    message: matched ?
      () => `'${propName}' prop is given '${defaultValue}' as default` :
      () => `'${propName}' prop is not given '${defaultValue}' as default (is given '${given}')`,
    pass: matched
  };
}
