export { setConfig as config } from "./config";
export { default as vuexPlugin } from "./vuex-plugin";

import { toShow, toShowInNextTick } from "./matchers/toShow";
import { toHide, toHideInNextTick } from "./matchers/toHide";
import { toEmit, toEmitOnRoot } from "./matchers/toEmit";
import { toHaveEmitted, toHaveEmittedOnRoot } from "./matchers/toHaveEmitted";
import toDispatch from "./matchers/toDispatch";
import toHaveDispatched from "./matchers/toHaveDispatched";
import toRequireProp from "./matchers/toRequireProp";
import toHaveDefaultProp from "./matchers/toHaveDefaultProp";
import toBeValidProps from "./matchers/toBeValidProps";
import toBeValidProp from "./matchers/toBeValidProp";
import toBeValidPropWithTypeCheck from "./matchers/toBeValidWithTypeCheck";
import toBeValidPropWithCustomValidator from "./matchers/toBeValidPropWithCustomValidator";

const matchers = {
  toShow,
  toShowInNextTick,
  toHide,
  toHideInNextTick,
  toEmit,
  toEmitOnRoot,
  toHaveEmitted,
  toHaveEmittedOnRoot,
  toDispatch,
  toHaveDispatched,
  toBeValidProp,
  toBeValidProps,
  toRequireProp,
  toHaveDefaultProp,
  toBeValidPropWithTypeCheck,
  toBeValidPropWithCustomValidator
};

export {
  toShow,
  toShowInNextTick,
  toHide,
  toHideInNextTick,
  toEmit,
  toEmitOnRoot,
  toHaveEmitted,
  toHaveEmittedOnRoot,
  toDispatch,
  toHaveDispatched,
  toBeValidProp,
  toBeValidProps,
  toRequireProp,
  toHaveDefaultProp,
  toBeValidPropWithTypeCheck,
  toBeValidPropWithCustomValidator
}

export default matchers;
