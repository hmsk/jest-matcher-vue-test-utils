import Vue from "vue";
import { shallowMount } from "@vue/test-utils";
import { MatcherComponent, MatcherComponentOptions } from "./main";
import { overwriteConfiguration, getConfiguration } from "./config";

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
    shallowMount<V>(component, { ...mountOption, propsData });
    warnings = mock.calls || [];
  });

  return warnings;
}
