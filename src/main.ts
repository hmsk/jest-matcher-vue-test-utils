import { shallowMount, VueClass, ThisTypedShallowMountOptions, ShallowMountOptions } from "@vue/test-utils";
import Vue, { ComponentOptions, FunctionalComponentOptions } from "vue";

import { overwriteConfiguration, getConfiguration, setConfig } from "./config";
export const config = setConfig;

declare type MatcherComponent<V extends Vue> = VueClass<V> | ComponentOptions<V> | FunctionalComponentOptions;
export declare type MatcherComponentOptions<V extends Vue> = ThisTypedShallowMountOptions<V> | ShallowMountOptions<Vue>;
declare type MatcherResult = { message (): string, pass: boolean };

export function toRequireProp<V extends Vue> (
  received: MatcherComponent<V>,
  propName: string,
  dynamicMountOptions?: MatcherComponentOptions<V>
): MatcherResult {
  const original = console.error;
  console.error = jest.fn();

  const mountOption = dynamicMountOptions ?
    overwriteConfiguration<V>({ mountOptions: dynamicMountOptions }).mountOptions :
    getConfiguration<V>().mountOptions;

  shallowMount<V>(received, mountOption);

  const found = (console.error as jest.Mock).mock.calls.find((c) => {
    return c.find((arg: string) => arg.includes(`Missing required prop: "${propName}"\n`))
  });

  console.error = original;

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
  const original = console.error;
  console.error = jest.fn();

  const mountOption = dynamicMountOptions ?
    overwriteConfiguration<V>({ mountOptions: dynamicMountOptions }).mountOptions :
    getConfiguration<V>().mountOptions;

  const wrapper = shallowMount<V>(received, { ...mountOption });
  const given = wrapper.props()[propName];
  const matched = (this as jest.MatcherUtils).equals(given, defaultValue);

  console.error = original;

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
  const original = console.error;
  console.error = jest.fn();

  const mountOption = dynamicMountOptions ?
    overwriteConfiguration<V>({ mountOptions: dynamicMountOptions }).mountOptions :
    getConfiguration<V>().mountOptions;
  const propsData = {};
  propsData[propName] = value;

  shallowMount<V>(received, { ...mountOption, propsData });

  const found = (console.error as jest.Mock).mock && (console.error as jest.Mock).mock.calls.find((c) => {
    return c.find((arg: string) => arg.includes(`Invalid prop: type check failed for prop "${propName}".`));
  });

  console.error = original;

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
  const original = console.error;
  console.error = jest.fn();

  const mountOption = dynamicMountOptions ?
    overwriteConfiguration<V>({ mountOptions: dynamicMountOptions }).mountOptions :
    getConfiguration<V>().mountOptions;
  const propsData = {};
  propsData[propName] = value;

  shallowMount<V>(received, { ...mountOption, propsData });

  const found = (console.error as jest.Mock).mock && (console.error as jest.Mock).mock.calls.find((c) => {
    return c.find((arg: string) => arg.includes(`Invalid prop: custom validator check failed for prop "${propName}".\n`));
  });

  console.error = original;

  return {
    message: !!!found ?
      () => `'${propName}' prop is valid with '${value}'` :
      () => `'${propName}' prop is invalid with '${value}'`,
    pass: !!!found
  };
}

const matchers = {
  toRequireProp,
  toHaveDefaultProp,
  toBeValidPropWithTypeCheck,
  toBeValidPropWithCustomValidator
};

export default matchers;
