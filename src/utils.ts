import Vue, { ComponentOptions, FunctionalComponentOptions } from "vue";
import { DefaultProps, PropsDefinition } from 'vue/types/options'
import { shallowMount, VueClass, ThisTypedShallowMountOptions, ShallowMountOptions, NameSelector, RefSelector, Wrapper } from "@vue/test-utils";
import { overwriteConfiguration, getConfiguration } from "./config";

export declare type MatcherComponent<V extends Vue> = VueClass<V> | ComponentOptions<V> | FunctionalComponentOptions;
export declare type MatcherComponentOptions<V extends Vue> = ThisTypedShallowMountOptions<V> | ShallowMountOptions<Vue>;

export declare type WrapperFindArgument<R, S = never> =
  R extends Vue ?
    ComponentOptions<R> | VueClass<R> :
    string | NameSelector | RefSelector | FunctionalComponentOptions<R, S>;

export type MatcherResult = { message (): string, pass: boolean };

export const withMockWarning = (doesDuringMock) => {
  const original = console.error;
  console.error = jest.fn();
  doesDuringMock((console.error as jest.Mock).mock);
  console.error = original;
};

export const getWarningsByMount = <V extends Vue> (
  component: MatcherComponent<V>,
  propsData: any,
  dynamicMountOptions?: MatcherComponentOptions<V>
) => {
  const mountOption = dynamicMountOptions ?
    overwriteConfiguration<V>({ mountOptions: dynamicMountOptions }).mountOptions :
    getConfiguration<V>().mountOptions;

  let warnings;
  withMockWarning((mock) => {
    shallowMount<V>(corkComponent(component), { ...mountOption, propsData });
    warnings = mock.calls || [];
  });

  return warnings;
}

export const corkComponent = <V extends Vue> (
  component: MatcherComponent<V>
) => {
  return {
    mixins: [component],
    template: "<h1>mocked template</h1>"
  } as ComponentOptions<V>; // mixins is not compatible actually since that expects ComponentOptions<Vue> unintentionally
};

const isFunctionalComponentOptions = <X extends {}> (obj: X): obj is X & Record<"functional", boolean> => {
  return obj.hasOwnProperty("functional");
};

const isNameSelector = <X extends {}> (obj: X): obj is X & NameSelector => {
  return Object.keys(obj).length == 1 && obj.hasOwnProperty("name");
};

const isRefSelector = <X extends {}> (obj: X): obj is X & RefSelector => {
  return Object.keys(obj).length == 1 && obj.hasOwnProperty("ref");
};

export function findOrFindComponent  <V extends Vue, R = DefaultProps, S = PropsDefinition<DefaultProps>> (wrapper: Wrapper<V>, findArgument: WrapperFindArgument<R, S>): Wrapper<Vue>;
export function findOrFindComponent  <V extends Vue, R extends Vue, S = never> (wrapper: Wrapper<V>, findArgument: WrapperFindArgument<R, S>): Wrapper<R>;
export function findOrFindComponent  <V extends Vue, R = never, S = never> (wrapper: Wrapper<V>, findArgument: WrapperFindArgument<R, S>): Wrapper<Vue> {
  if (typeof findArgument === 'string') {
    return wrapper.find(findArgument);
 } else if (isRefSelector(findArgument)) {
    return wrapper.find(findArgument);
  } else if (isNameSelector(findArgument)) {
    return wrapper.find(findArgument);
  } else if (isFunctionalComponentOptions(findArgument)) {
    return wrapper.findComponent<R, S>(findArgument);
  } else {
    // @ts-ignore
    return wrapper.findComponent<R>(findArgument);
  }
}
