import Vue from "vue";
import { shallowMount } from "@vue/test-utils";
import { MatcherComponent, MatcherComponentOptions } from "./main";
import { overwriteConfiguration, getConfiguration } from "./config";

export const getWarningsByMount = <V extends Vue> (
  component: MatcherComponent<V>,
  propsData: any,
  dynamicMountOptions?: MatcherComponentOptions<V>
) => {
  const original = console.error;
  console.error = jest.fn();

  const mountOption = dynamicMountOptions ?
    overwriteConfiguration<V>({ mountOptions: dynamicMountOptions }).mountOptions :
    getConfiguration<V>().mountOptions;

  shallowMount<V>(component, { ...mountOption, propsData });

  const warnings = (console.error as jest.Mock).mock.calls || [];

  console.error = original;
  return warnings;
}
