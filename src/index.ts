import { shallowMount, Wrapper, VueClass, NameSelector, ThisTypedShallowMountOptions, ShallowMountOptions } from "@vue/test-utils";
import Vue, { ComponentOptions, FunctionalComponentOptions } from "vue";

import { overwriteConfiguration, getConfiguration, setConfig } from "./config";
export const config = setConfig;

import { withMockWarning, getWarningsByMount, corkComponent } from "./utils";

export declare type MatcherComponent<V extends Vue> = VueClass<V> | ComponentOptions<V> | FunctionalComponentOptions;
export declare type MatcherComponentOptions<V extends Vue> = ThisTypedShallowMountOptions<V> | ShallowMountOptions<Vue>;
export declare type WrapperFindArgument<V extends Vue> = string | NameSelector | FunctionalComponentOptions | VueClass<import("vue").default> | MatcherComponentOptions<V>;
declare type MatcherResult = { message (): string, pass: boolean };

export interface ComponentProp {
  [name: string]: any;
}

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Asserts that the action shows the specific content
       * @param wrapper - The wrapper of vue-test-utils
       * @param findAgrument - The argument for "wrapper.find" to find the specific content
       * @example
       * expect(() => somethingGreat()).toShow(wrapper, "p.error")
       */
      toShow (wrapper: Wrapper<Vue>, findArgument: WrapperFindArgument<Vue>): R;
      /**
       * Asserts that the action hides the specific content
       * @param wrapper - The wrapper of vue-test-utils
       * @param findAgrument - The argument for "wrapper.find" to find the specific content
       * @example
       * expect(() => somethingGreat()).toHide(wrapper, "p.error")
       */
      toHide (wrapper: Wrapper<Vue>, findAgrument: WrapperFindArgument<Vue>): R;

      /**
       * Asserts that the action shows the specific content
       * @param {string} eventName - The eventName
       * @example
       * expect(wrapper).toBeEmitted("input")
       */
      toBeEmitted (eventName: string): R;

      /**
       * Asserts that the component requires the prop
       * @param {string} prop - The prop's name
       * @param options - Mount Option of the component
       * @example
       * expect(AComponent).toRequireProp("type")
       */
      toRequireProp (prop: string, options?: MatcherComponentOptions<Vue>): R;
      /**
       * Asserts that the component gives default value for the prop
       * @param {string} prop - The prop's name
       * @param {any} defaultValue - The default value you're expecting for the prop
       * @param options - Mount Option of the component
       * @example
       * expect(AComponent).toHaveDefaultProp("type", "I am a default message")
       */
      toHaveDefaultProp (prop: string, defaultValue: any, options?: MatcherComponentOptions<Vue>): R;
      /**
       * Asserts that the component accepts the set of props
       * @param {any} props - The set of props
       * @param options - Mount Option of the component
       * @example
       * expect(AComponent).toBeValidProps({ type: "the type", color: "cool one"})
       */
      toBeValidProps (props: ComponentProp, options?: MatcherComponentOptions<Vue>): R;
      /**
       * Asserts that the component accepts the value for the single prop
       * @param {string} prop - The prop's name
       * @param {any} sampleValue - The value you give for the prop
       * @param options - Mount Option of the component
       * @example
       * expect(AComponent).toBeValidProp("type", "hope this value accepts")
       */
      toBeValidProp (prop: string, sampleValue: any, options?: MatcherComponentOptions<Vue>): R;
      /**
       * Asserts that the component accepts the type for the single prop
       * @param {string} prop - The prop's name
       * @param {any} type - The type (String|Number|Boolean|Array|Object|Date|Function|Symbol|[your prototype instance])
       * @param options - Mount Option of the component
       * @example
       * expect(AComponent).toBeValidPropWithTypeCheck("color", String)
       */
      toBeValidPropWithTypeCheck (prop: string, type: any | any[], options?: MatcherComponentOptions<Vue>): R;
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

export function toShow<V extends Vue> (
  action: Function,
  wrapper: Wrapper<V>,
  findArgument: WrapperFindArgument<V>
): MatcherResult {
  const before = wrapper.contains(findArgument);
  action();
  const after = wrapper.contains(findArgument);

  let message, result;

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

export function toHide<V extends Vue> (
  action: Function,
  wrapper: Wrapper<V>,
  findArgument: WrapperFindArgument<V>
): MatcherResult {
  const before = wrapper.contains(findArgument);
  action();
  const after = wrapper.contains(findArgument);

  let message, result;

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

export function toBeEmitted<V extends Vue> (
  wrapper: Wrapper<V>,
  eventName: string
): MatcherResult {
  const emitted = wrapper.emitted()[eventName] || [];
  return {
    message: emitted.length > 0 ?
      () => `The "${eventName}" event was emitted` :
      () => `The "${eventName}" event was never emitted`,
    pass: emitted.length > 0
  }
}

export function toBeValidProps<V extends Vue> (
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

export function toBeValidProp<V extends Vue> (
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

export function toRequireProp<V extends Vue> (
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

export function toHaveDefaultProp<V extends Vue> (
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

export function toBeValidPropWithTypeCheck<V extends Vue> (
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

export function toBeValidPropWithCustomValidator<V extends Vue> (
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

const matchers = {
  toShow,
  toHide,
  toBeEmitted,
  toBeValidProp,
  toBeValidProps,
  toRequireProp,
  toHaveDefaultProp,
  toBeValidPropWithTypeCheck,
  toBeValidPropWithCustomValidator
};

export default matchers;
