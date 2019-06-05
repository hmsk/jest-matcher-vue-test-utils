import { Store, ActionPayload } from "vuex";

export const storeKey = "jestMatcherVueTestUtils";

const defineLogger = (store: Store<{}>) => {
  const log: { dispatched: ActionPayload[] } = {
    dispatched: []
  };

  store.subscribeAction((action, _state) => {
    log.dispatched.push(action);
  });

  Object.defineProperty(store, storeKey, {
    value: log,
    writable: false,
    enumerable: true,
    configurable: false
  });
}

const generatePlugin = <S>() => (store: Store<S>) => defineLogger(store);

export default generatePlugin;
