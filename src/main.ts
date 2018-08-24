import { shallowMount, VueClass, ThisTypedShallowMountOptions, ShallowMountOptions } from "@vue/test-utils";
import Vue, { ComponentOptions, FunctionalComponentOptions } from "vue";
import isEqual from "lodash.isequal";

declare type MatcherComponent<V extends Vue> = VueClass<V> | ComponentOptions<V> | FunctionalComponentOptions;
declare type MatcherComponentOptions<V extends Vue> = ThisTypedShallowMountOptions<V> | ShallowMountOptions<Vue>;
declare type MatcherMountOptions<V extends Vue> = ThisTypedShallowMountOptions<V> | ShallowMountOptions<Vue>;
declare interface MatcherDynamicConfig<V extends Vue> {
  mountOptions: MatcherMountOptions<V>;
}
declare type MatcherResult = { message (): string, pass: boolean };

let configuration: MatcherDynamicConfig<Vue> = {
  mountOptions: {}
};

export function config <V extends Vue>(overwrite: MatcherDynamicConfig<V>) {
  configuration = overwriteConfiguration(overwrite);
};

const getConfiguration = <V extends Vue>(): MatcherDynamicConfig<V> => {
  return {
    mountOptions: configuration.mountOptions
  }
};

const overwriteConfiguration = <V extends Vue>(overwrite: MatcherDynamicConfig<V>): MatcherDynamicConfig<V> => {
  return {
    mountOptions: { ...getConfiguration().mountOptions, ...overwrite.mountOptions }
  };
};

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
  const matched = isEqual(given, defaultValue);

  console.error = original;

  return {
    message: matched ?
      () => `'${propName}' prop is given '${defaultValue}' as default` :
      () => `'${propName}' prop is not given '${defaultValue}' as default (is given '${given}')`,
    pass: matched
  };
}

const matchers = {
  toRequireProp,
  toHaveDefaultProp
};

export default matchers;
