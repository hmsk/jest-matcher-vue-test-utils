import Vue, { ComponentOptions, FunctionalComponentOptions } from "vue";
import { shallowMount, VueClass, ThisTypedShallowMountOptions, ShallowMountOptions, Selector, NameSelector, RefSelector, Wrapper } from "@vue/test-utils";
import { overwriteConfiguration, getConfiguration } from "./config";

export declare type MatcherComponent<V extends Vue> = VueClass<V> | ComponentOptions<V> | FunctionalComponentOptions;
export declare type MatcherComponentOptions<V extends Vue> = ThisTypedShallowMountOptions<V> | ShallowMountOptions<Vue>;

export declare type VueTestUtilsFindArgument = Selector | NameSelector | RefSelector;

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

export const findOrFindComponent = <V extends Vue>(wrapper: Wrapper<V>,findArgument: VueTestUtilsFindArgument) => {
  // RefSelector, NameSelector should use `find` probably, but @vue/test-utils expect `findComponent` as its implementation
  // @ts-ignore: The typedef on @vue/test-utils is wrong, index.d.ts doesn't catch up its actual implementations
  return typeof findArgument !== 'string' ? wrapper.findComponent(findArgument) : wrapper.find(findArgument);
}
