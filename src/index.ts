export { setConfig as config } from "./config";
export { default as vuexPlugin } from "./vuex-plugin";

import toShow from "./matchers/toShow";
import toHide from "./matchers/toHide";
import toEmit from "./matchers/toEmit";
import toHaveEmitted from "./matchers/toHaveEmitted";
import toHaveEmittedOnRoot from "./matchers/toHaveEmittedOnRoot";
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
  toHide,
  toEmit,
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
  toHide,
  toEmit,
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
