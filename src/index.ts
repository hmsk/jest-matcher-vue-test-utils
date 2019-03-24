import { VueClass, NameSelector, ThisTypedShallowMountOptions, ShallowMountOptions } from "@vue/test-utils";
import Vue, { ComponentOptions, FunctionalComponentOptions } from "vue";

import { setConfig } from "./config";
export const config = setConfig;

export declare type MatcherComponent<V extends Vue> = VueClass<V> | ComponentOptions<V> | FunctionalComponentOptions;
export declare type MatcherComponentOptions<V extends Vue> = ThisTypedShallowMountOptions<V> | ShallowMountOptions<Vue>;
export declare type WrapperFindArgument<V extends Vue> = string | NameSelector | FunctionalComponentOptions | VueClass<import("vue").default> | MatcherComponentOptions<V>;

import toShow from "./matchers/toShow";
import toHide from "./matchers/toHide";
import toEmit from "./matchers/toEmit";
import toHaveEmitted from "./matchers/toHaveEmitted";
import toDispatch from "./matchers/toDispatch";
import toHaveDispatched from "./matchers/toHaveDispatched";
import toRequireProp from "./matchers/toRequireProp";
import toHaveDefaultProp from "./matchers/toHaveDefaultProp";
import toBeValidProps from "./matchers/toBeValidProps";
import toBeValidProp from "./matchers/toBeValidProp";
import toBeValidPropWithTypeCheck from "./matchers/toBeValidWithTypeCheck";
import toBeValidPropWithCustomValidator from "./matchers/toBeValidPropWithCustomValidator";

import vuexPlugin from "./vuex-plugin";

export {
  toShow,
  toHide,
  toEmit,
  toHaveEmitted,
  toDispatch,
  toHaveDispatched,
  toRequireProp,
  toHaveDefaultProp,
  toBeValidProps,
  toBeValidProp,
  toBeValidPropWithTypeCheck,
  toBeValidPropWithCustomValidator,
  vuexPlugin
};

const matchers = {
  toShow,
  toHide,
  toEmit,
  toHaveEmitted,
  toDispatch,
  toHaveDispatched,
  toBeValidProp,
  toBeValidProps,
  toRequireProp,
  toHaveDefaultProp,
  toBeValidPropWithTypeCheck,
  toBeValidPropWithCustomValidator
};

export default matchers;
