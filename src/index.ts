import { shallowMount, Wrapper, VueClass, NameSelector, RefSelector, ThisTypedShallowMountOptions, ShallowMountOptions } from "@vue/test-utils";
import Vue, { ComponentOptions, FunctionalComponentOptions } from "vue";

import { overwriteConfiguration, getConfiguration, setConfig } from "./config";
export const config = setConfig;

import { withMockWarning, getWarningsByMount } from "./utils";

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
      toAppear (wrapper: Wrapper<Vue>, findArgument: WrapperFindArgument<Vue>): R;
      toDisappear (wrapper: Wrapper<Vue>, findAgrument: WrapperFindArgument<Vue>): R;
      toRequireProp (prop: string, options?: ComponentOptions<Vue>): R;
      toHaveDefaultProp (prop: string, defaultValue: any, options?: ComponentOptions<Vue>): R;
      toBeValidProps (props: ComponentProp, options?: ComponentOptions<Vue>): R;
      toBeValidProp (prop: string, sampleValue: any, options?: ComponentOptions<Vue>): R;
      toBeValidPropWithTypeCheck (prop: string, type: any | any[], options?: ComponentOptions<Vue>): R;
      toBeValidPropWithCustomValidator (prop: string, sampleValue: any, options?: ComponentOptions<Vue>): R;
    }
  }
}

export function toAppear<V extends Vue> (
  action: Function,
  wrapper: Wrapper<V>,
  findArgument: WrapperFindArgument<V>
): MatcherResult {
  const before = wrapper.contains(findArgument);
  action();
  const after = wrapper.contains(findArgument);

  let message, result;

  if (before) {
    message = "The target appears from the beginning";
    result = false;
  } else if (!after) {
    message = "The target doesn't show even if the action runs";
    result = false;
  } else {
    message = "The target appears by the action"
    result = true;
  }

  return {
    message: () => message,
    pass: result
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
    wrapper = shallowMount<V>(received, { ...mountOption });
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
  toAppear,
  toBeValidProp,
  toBeValidProps,
  toRequireProp,
  toHaveDefaultProp,
  toBeValidPropWithTypeCheck,
  toBeValidPropWithCustomValidator
};

export default matchers;
