import Vue from "vue";
import { ThisTypedShallowMountOptions, ShallowMountOptions } from "@vue/test-utils";

declare type MatcherMountOptions<V extends Vue> = ThisTypedShallowMountOptions<V> | ShallowMountOptions<Vue>;

declare interface MatcherDynamicConfig<V extends Vue> {
  mountOptions: MatcherMountOptions<V>;
}

export let configuration: MatcherDynamicConfig<Vue> = {
  mountOptions: {}
};

export function setConfig (overwrite: MatcherDynamicConfig<Vue>) {
  configuration = overwriteConfiguration(overwrite);
};

export const getConfiguration = <V extends Vue>(): MatcherDynamicConfig<V> => {
  return {
    mountOptions: configuration.mountOptions
  }
};

export const overwriteConfiguration = <V extends Vue>(overwrite: MatcherDynamicConfig<V>): MatcherDynamicConfig<V> => {
  return {
    mountOptions: {
      ...getConfiguration().mountOptions,
      ...overwrite.mountOptions
    }
  };
};
