import {
  config,
  toEmit,
  toEmitOnRoot,
  toHaveEmitted,
  toHaveEmittedOnRoot
} from "@/index";

import Component from "./fixtures/event.vue";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import { MatcherResult } from '@/utils';

expect.extend({
  toEmit,
  toEmitOnRoot,
  toHaveEmitted,
  toHaveEmittedOnRoot
});

config({
  mountOptions: { localVue: createLocalVue() }
});

const emitEvent = (wrapper, eventName, payload) => {
  (wrapper.vm as any).emitEventWithPayload(eventName, payload);
};

const emitEventOnRoot = (wrapper, eventName, payload) => {
  (wrapper.vm as any).emitEventOnRootWithPayload(eventName, payload);
};

const doAsyncronously = (callback: Function): Promise<any> => {
  return new Promise((resolve) => {
    callback();
    resolve();
  });
}

describe("toHaveEmitted", () => {
  describe("as a function which is registered to jest", () => {
    it("returns true if the event is emitted", () => {
      const wrapper = shallowMount(Component);
      wrapper.trigger("click");
      const result = toHaveEmitted(wrapper, "special");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe('The "special" event was emitted');
    });

    it("returns false if the event is not emitted", () => {
      const wrapper = shallowMount(Component);
      const result = toHaveEmitted(wrapper, "special");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('The "special" event was never emitted');
    });

    it("returns false if the another event is emitted", () => {
      const wrapper = shallowMount(Component);
      wrapper.trigger("another");
      const result = toHaveEmitted(wrapper, "special");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('The "special" event was never emitted');
    });
  });

  describe("actual use", () => {
    it("doesn't claim for positive expectation when expected event happens", () => {
      const wrapper = shallowMount(Component);
      wrapper.trigger("click");
      expect(wrapper).toHaveEmitted("special");
    });

    it("doesn't claim for negative expectation when expected event doesn't happen", () => {
      const wrapper = shallowMount(Component);
      expect(wrapper).not.toHaveEmitted("special");
    });

    it("doesn't claim for negative expectation when unintentional event happens", () => {
      const wrapper = shallowMount(Component);
      wrapper.trigger("another");
      expect(wrapper).not.toHaveEmitted("special");
    });
  });
});

describe("toHaveEmitted with payload", () => {
  describe("as a function which is registered to jest", () => {
    it("returns true if the event is emitted with the expected payload", () => {
      const wrapper = shallowMount(Component);
      emitEvent(wrapper, "special", { value: "something" });
      const result = toHaveEmitted(wrapper, "special", { value: "something" });
      expect(result.pass).toBe(true);
      expect(result.message()).toBe('The "special" event was emitted with the expected payload');
    });

    it("returns false if the event is not emitted", () => {
      const wrapper = shallowMount(Component);
      const result = toHaveEmitted(wrapper, "special", "something");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('The "special" event was never emitted');
    });

    it("returns false if the another event is emitted", () => {
      const wrapper = shallowMount(Component);
      emitEvent(wrapper, "another", { value: "something" });
      const result = toHaveEmitted(wrapper, "special", { value: "something" });
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('The "special" event was never emitted');
    });

    describe("when the event is emitted but the payload is not matched", () => {
      const subject = () => {
        const wrapper = shallowMount(Component);
        emitEvent(wrapper, "special", { value: "anything" });
        return toHaveEmitted(wrapper, "special", "some text", { value: "something" });
      };

      it("returns false", () => {
        expect(subject().pass).toBe(false);
      });

      it("tells the reason", () => {
        expect(subject().message()).toContain('The "special" event was emitted but the payload is not matched');
      });

      it("shows the diff of payloads", () => {
        const message = subject().message();
        expect(message).toContain("'special' event #0 payloads:");
        expect(message).toContain("- Expected");
        expect(message).toContain("+ Emitted");
        expect(message).toContain('-   "some text"');
        expect(message).toContain('-     "value": "something"');
        expect(message).toContain('+     "value": "anything"');
      });
    });
  });

  describe("actual use", () => {
    it("passes for expected case positively", () => {
      const wrapper = shallowMount(Component);
      emitEvent(wrapper, "special", { value: "actual life" });
      expect(wrapper).toHaveEmitted("special", { value: "actual life" });
    });

    it("passes negatively when any event was not emitted", () => {
      const wrapper = shallowMount(Component);
      expect(wrapper).not.toHaveEmitted("special", { value: "unusual life" });
    });

    it("passes negatively when unintentional event was emitted", () => {
      const wrapper = shallowMount(Component);
      emitEvent(wrapper, "another", { value: "actual life" });
      expect(wrapper).not.toHaveEmitted("special", { value: "unusual life" });
    });

    it("passes negatively when the expected event is emitted but the payload is not matched", () => {
      const wrapper = shallowMount(Component);
      emitEvent(wrapper, "special", { value: "actual life" });
      expect(wrapper).not.toHaveEmitted("special", { value: "exciting life" });
    });

    describe("multiple payloads", () => {
      it("passes positively when the expected event is emitted with the multiple payloads by the function", () => {
        const wrapper = shallowMount(Component);
        (wrapper.vm as any).emitEventWithMultiplePayload("multi!");
        expect(wrapper).toHaveEmitted("multi!", "a", 5, ["C"]);
      });

      it("passes positively for expect helper to assert with 'anything'", () => {
        const wrapper = shallowMount(Component);
        (wrapper.vm as any).emitEventWithMultiplePayload("multi!!");
        expect(wrapper).toHaveEmitted("multi!!", "a", expect.anything(), expect.arrayContaining(["C"]));
      });

      it("passes negatively when the number of paylod is shorter than actual (even they are matching)", () => {
        const wrapper = shallowMount(Component);
        (wrapper.vm as any).emitEventWithMultiplePayload("multi!");
        expect(wrapper).not.toHaveEmitted("multi!", "a", 5);
      });

      it("passes negatively when the number of paylod is longer", () => {
        const wrapper = shallowMount(Component);
        (wrapper.vm as any).emitEventWithMultiplePayload("multi!");
        expect(wrapper).not.toHaveEmitted("multi!", "a", 5, ["C"], "e");
      });
    });
  });
});

describe("toHaveEmittedOnRoot", () => {
  describe("as a function which is registered to jest", () => {
    it("returns true if the event is emitted on $root", () => {
      const wrapper = shallowMount(Component);
      wrapper.trigger("blur");
      const result = toHaveEmittedOnRoot(wrapper, "blured");
      expect(result.pass).toBe(true);
      expect(result.message()).toBe('The "blured" event was emitted on $root');
    });

    it("returns false if the event is not emitted on $root", () => {
      const wrapper = shallowMount(Component);
      const result = toHaveEmittedOnRoot(wrapper, "blured");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('The "blured" event was never emitted on $root');
    });

    it("returns false if the another event is emitted on $root", () => {
      const wrapper = shallowMount(Component);
      wrapper.vm.$root.$emit("another");
      const result = toHaveEmittedOnRoot(wrapper, "blured");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('The "blured" event was never emitted on $root');
    });
  });

  describe("actual use", () => {
    it("doesn't claim for positive expectation when expected event happens", () => {
      const wrapper = shallowMount(Component);
      wrapper.trigger("blur");
      expect(wrapper).toHaveEmittedOnRoot("blured");
    });

    it("doesn't claim for negative expectation when expected event doesn't happen", () => {
      const wrapper = shallowMount(Component);
      expect(wrapper).not.toHaveEmittedOnRoot("blured");
    });

    it("doesn't claim for negative expectation when unintentional event happens", () => {
      const wrapper = shallowMount(Component);
      wrapper.vm.$root.$emit("another");
      expect(wrapper).not.toHaveEmittedOnRoot("blured");
    });
  });
});

describe("toHaveEmittedOnRoot with payload", () => {
  describe("as a function which is registered to jest", () => {
    it("returns true if the event is emitted with the expected payload", () => {
      const wrapper = shallowMount(Component);
      emitEventOnRoot(wrapper, "rooty", { value: "something" });
      const result = toHaveEmittedOnRoot(wrapper, "rooty", { value: "something" });
      expect(result.pass).toBe(true);
      expect(result.message()).toBe('The "rooty" event was emitted on $root with the expected payload');
    });

    it("returns false if the event is not emitted", () => {
      const wrapper = shallowMount(Component);
      const result = toHaveEmittedOnRoot(wrapper, "rooty", "something");
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('The "rooty" event was never emitted on $root');
    });

    it("returns false if the another event is emitted", () => {
      const wrapper = shallowMount(Component);
      emitEventOnRoot(wrapper, "another", { value: "something" });
      const result = toHaveEmittedOnRoot(wrapper, "rooty", { value: "something" });
      expect(result.pass).toBe(false);
      expect(result.message()).toBe('The "rooty" event was never emitted on $root');
    });

    describe("when the event is emitted but the payload is not matched", () => {
      const subject = () => {
        const wrapper = shallowMount(Component);
        emitEventOnRoot(wrapper, "rooty", { value: "anything" });
        return toHaveEmittedOnRoot(wrapper, "rooty", "some text", { value: "something" });
      };

      it("returns false", () => {
        expect(subject().pass).toBe(false);
      });

      it("tells the reason", () => {
        expect(subject().message()).toContain('The "rooty" event was emitted on $root but the payload is not matched');
      });

      it("shows the diff of payloads", () => {
        const message = subject().message();
        expect(message).toContain("'rooty' event #0 payloads:");
        expect(message).toContain("- Expected");
        expect(message).toContain("+ Emitted");
        expect(message).toContain('-   "some text"');
        expect(message).toContain('-     "value": "something"');
        expect(message).toContain('+     "value": "anything"');
      });
    });
  });

  describe("actual use", () => {
    it("passes for expected case positively", () => {
      const wrapper = shallowMount(Component);
      emitEventOnRoot(wrapper, "rooty", { value: "actual life" });
      expect(wrapper).toHaveEmittedOnRoot("rooty", { value: "actual life" });
    });

    it("passes negatively when any event was not emitted", () => {
      const wrapper = shallowMount(Component);
      expect(wrapper).not.toHaveEmittedOnRoot("rooty", { value: "unusual life" });
    });

    it("passes negatively when unintentional event was emitted", () => {
      const wrapper = shallowMount(Component);
      emitEventOnRoot(wrapper, "another", { value: "actual life" });
      expect(wrapper).not.toHaveEmittedOnRoot("rooty", { value: "unusual life" });
    });

    it("passes negatively when the expected event is emitted but the payload is not matched", () => {
      const wrapper = shallowMount(Component);
      emitEventOnRoot(wrapper, "rooty", { value: "actual life" });
      expect(wrapper).not.toHaveEmitted("rooty", { value: "exciting life" });
    });

    describe("multiple payloads", () => {
      it("passes positively when the expected event is emitted with the multiple payloads by the function", () => {
        const wrapper = shallowMount(Component);
        (wrapper.vm as any).emitEventOnRootWithMultiplePayload("multiOnRoot!");
        expect(wrapper).toHaveEmittedOnRoot("multiOnRoot!", ["D"], 3, "e");
      });

      it("passes positively for expect helper to assert with 'anything'", () => {
        const wrapper = shallowMount(Component);
        (wrapper.vm as any).emitEventOnRootWithMultiplePayload("multiOnRoot!!");
        expect(wrapper).toHaveEmittedOnRoot("multiOnRoot!!", expect.arrayContaining(["D"]), expect.anything(), "e");
      });

      it("passes negatively when the number of paylod is shorter than actual (even they are matching)", () => {
        const wrapper = shallowMount(Component);
        (wrapper.vm as any).emitEventOnRootWithMultiplePayload("multiOnRoot!");
        expect(wrapper).not.toHaveEmittedOnRoot("multiOnRoot!", ["D"], 3);
      });

      it("passes negatively when the number of paylod is longer", () => {
        const wrapper = shallowMount(Component);
        (wrapper.vm as any).emitEventOnRootWithMultiplePayload("multiOnRoot!");
        expect(wrapper).not.toHaveEmittedOnRoot("multiOnRoot!", ["D"], 3, "e", "additional");
      });
    });
  });
});

describe("toEmit", () => {
  describe("as a function which is registered to jest", () => {
    describe("returns true if the event is emitted", () => {
      it("by the synchronous function", () => {
        const wrapper = shallowMount(Component);
        const result = toEmit(() => {
          wrapper.trigger("click");
        }, wrapper, "special") as MatcherResult;
        expect(result.pass).toBe(true);
        expect(result.message()).toBe('The function emitted the "special" event');
      });

      it("by the asynchronous function", async () => {
        const wrapper = shallowMount(Component);
        const result = await toEmit(async () => {
          return doAsyncronously(() => {
            wrapper.trigger("click");
          });
        }, wrapper, "special");
        expect(result.pass).toBe(true);
        expect(result.message()).toBe('The function emitted the "special" event');
      });
    });

    describe("returns false if the event is not emitted", () => {
      it("by the synchronous function", () => {
        const wrapper = shallowMount(Component);
        const result = toEmit(() => { /* nothing to do */ }, wrapper, "special") as MatcherResult;
        expect(result.pass).toBe(false);
        expect(result.message()).toBe('The function did not emit the "special" event');
      });

      it("by the asynchronous function", async () => {
        const wrapper = shallowMount(Component);
        const result = await toEmit(async () => "nothing to do", wrapper, "special");
        expect(result.pass).toBe(false);
        expect(result.message()).toBe('The function did not emit the "special" event');
      });
    });

    describe("returns false if the event is emitted before", () => {
      it("by the synchronous function", () => {
        const wrapper = shallowMount(Component);
        wrapper.trigger("click");
        const result = toEmit(() => { /* "nothing to do" */ }, wrapper, "special") as MatcherResult;
        expect(result.pass).toBe(false);
        expect(result.message()).toBe('The function did not emit the "special" event');
      });

      it("by the asynchrounous function", async () => {
        const wrapper = shallowMount(Component);
        wrapper.trigger("click");
        const result = await toEmit(async () => "nothing to do", wrapper, "special");
        expect(result.pass).toBe(false);
        expect(result.message()).toBe('The function did not emit the "special" event');
      });
    });

    describe("with payload", () => {
      describe("when the event is emitted but the payloads is not matched", () => {
        const subject = () => {
          const wrapper = shallowMount(Component);
          return toEmit(() => {
            emitEvent(wrapper, "special", { value: "actual life" });
            emitEvent(wrapper, "special", { value: "actual second life" });
          }, wrapper, "special", { value: "expected" }) as MatcherResult;
        };

        it("returns false", () => {
          expect(subject().pass).toBe(false);
        });

        it("tells the reason", () => {
          expect(subject().message()).toContain('The function emitted the \"special\" event, but the payload is not matched');
        });

        it("shows the diff of payloads", () => {
          const message = subject().message();
          expect(message).toContain("'special' event #0 payloads:");
          expect(message).toContain('+     "value": "actual life"');
          expect(message).toContain("'special' event #1 payloads:");
          expect(message).toContain('+     "value": "actual second life"');
          expect(message.match(/- Expected/g)).toHaveLength(2);
          expect(message.match(/\+ Emitted/g)).toHaveLength(2);
          expect(message.match(/-     "value": "expected"/g)).toHaveLength(2);
        });
      });
    });
  });

  describe("actual use", () => {
    describe("passes positively when the expected event is emitted by the function", () => {
      it("synchronously", () => {
        const wrapper = shallowMount(Component);
        expect(() => wrapper.trigger("click")).toEmit(wrapper, "special");
      });

      it("asynchronously", async () => {
        const wrapper = shallowMount(Component);
        return expect(async () => wrapper.trigger("click")).toEmit(wrapper, "special");
      });
    });

    describe("passes negatively when the expected event is not emitted by the function", () => {
      it("synchronously", () => {
        const wrapper = shallowMount(Component);
        expect(() => { /* nothing to do */ }).not.toEmit(wrapper, "special");
      });

      it("asynchronously", async () => {
        const wrapper = shallowMount(Component);
        return expect(async () => "nothing to do").not.toEmit(wrapper, "special");
      });
    });

    describe("passes negatively when the expected event is emitted before the function", () => {
      it("synchronously", () => {
        const wrapper = shallowMount(Component);
        wrapper.trigger("click")
        expect(() => { /* nothing to do */ }).not.toEmit(wrapper, "special");
      });

      it("asynchronously", async () => {
        const wrapper = shallowMount(Component);
        wrapper.trigger("click")
        return expect(async () => "nothing to do").not.toEmit(wrapper, "special");
      });
    });

    describe("with payload", () => {
      describe("passes positively when the expected event is emitted with the payload by the function", () => {
        it("synchronously", () => {
          const wrapper = shallowMount(Component);
          expect(() => {
            emitEvent(wrapper, "special", { value: "actual life" });
          }).toEmit(wrapper, "special", { value: "actual life" });
        });

        it("asynchronously", async () => {
          const wrapper = shallowMount(Component);
          return expect(async () => {
            return doAsyncronously(() => {
              emitEvent(wrapper, "special", { value: "actual life" });
            });
          }).toEmit(wrapper, "special", { value: "actual life" });
        });
      });

      describe("passes positively when the expected event is emitted with the payload by the function after emitted the same event with another payload", () => {
        it("synchronously", () => {
          const wrapper = shallowMount(Component);
          emitEvent(wrapper, "special", { value: "another life" });
          expect(() => {
            emitEvent(wrapper, "special", { value: "actual life" });
          }).toEmit(wrapper, "special", { value: "actual life" });
        });

        it("asynchronously", async () => {
          const wrapper = shallowMount(Component);
          emitEvent(wrapper, "special", { value: "another life" });
          return expect(async () => {
            return doAsyncronously(() => {
              emitEvent(wrapper, "special", { value: "actual life" });
            });
          }).toEmit(wrapper, "special", { value: "actual life" });
        });
      });

      describe("passes negatively when the expected event is not emitted by the function", () => {
        it("synchronously", () => {
          const wrapper = shallowMount(Component);
          emitEvent(wrapper, "special", { value: "actual life" });
          expect(() => {
            // nothing to do
          }).not.toEmit(wrapper, "special", { value: "actual life" });
        });

        it("asynchronously", async () => {
          const wrapper = shallowMount(Component);
          emitEvent(wrapper, "special", { value: "actual life" });
          return expect(async () => {
            // nothing to do
          }).not.toEmit(wrapper, "special", { value: "actual life" });
        });
      });

      describe("passes negatively when the expected event is emitted by the function, but the payload is not matched", () => {
        it("synchronously", () => {
          const wrapper = shallowMount(Component);
          expect(() => {
            emitEvent(wrapper, "special", { value: "unintentional life" });
          }).not.toEmit(wrapper, "special", { value: "actual life" });
        });

        it("asynchronously", async () => {
          const wrapper = shallowMount(Component);
          return expect(async () => {
            return doAsyncronously(() => {
              emitEvent(wrapper, "special", { value: "unintentional life" });
            });
          }).not.toEmit(wrapper, "special", { value: "actual life" });
        });
      });

      describe("multiple payloads", () => {
        describe("passes positively when the expected event is emitted with the multiple payloads by the function", () => {
          it("synchronously", () => {
            const wrapper = shallowMount(Component);
            expect(() => {
              (wrapper.vm as any).emitEventWithMultiplePayload("multi!");
            }).toEmit(wrapper, "multi!", "a", 5, ["C"]);
          });

          it("asynchronously", async () => {
            const wrapper = shallowMount(Component);
            return expect(async () => {
              return doAsyncronously(() => {
                (wrapper.vm as any).emitEventWithMultiplePayload("multi!");
              })
            }).toEmit(wrapper, "multi!", "a", 5, ["C"]);
          });
        });

        describe("passes positively for expect helper to assert with 'anything'", () => {
          it("synchronously", () => {
            const wrapper = shallowMount(Component);
            expect(() => {
              (wrapper.vm as any).emitEventWithMultiplePayload("multi!");
            }).toEmit(wrapper, "multi!", "a", expect.anything(), expect.arrayContaining(["C"]));
          });

          it("asynchronously", async () => {
            const wrapper = shallowMount(Component);
            return expect(async () => {
              return doAsyncronously(() => {
                (wrapper.vm as any).emitEventWithMultiplePayload("multi!");
              });
            }).toEmit(wrapper, "multi!", "a", expect.anything(), expect.arrayContaining(["C"]));
          });
        });

        describe("passes negatively when the number of paylod is shorter than actual (even they are matching)", () => {
          it("synchronously", () => {
            const wrapper = shallowMount(Component);
            expect(() => {
              (wrapper.vm as any).emitEventWithMultiplePayload("multi!");
            }).not.toEmit(wrapper, "multi!", "a", 5);
          });

          it("asynchronously", async () => {
            const wrapper = shallowMount(Component);
            return expect(async () => {
              return doAsyncronously(() => {
                (wrapper.vm as any).emitEventWithMultiplePayload("multi!");
              });
            }).not.toEmit(wrapper, "multi!", "a", 5);
          });
        });

        describe("passes negatively when the number of paylod is longer", () => {
          it("synchronously", () => {
            const wrapper = shallowMount(Component);
            expect(() => {
              (wrapper.vm as any).emitEventWithMultiplePayload("multi!");
            }).not.toEmit(wrapper, "multi!", "a", 5, ["C"], "e");
          });

          it("asynchronously", async () => {
            const wrapper = shallowMount(Component);
            return expect(async () => {
              return doAsyncronously(() => {
                (wrapper.vm as any).emitEventWithMultiplePayload("multi!");
              });
            }).not.toEmit(wrapper, "multi!", "a", 5, ["C"], "e");
          });
        });
      });
    });
  });
});

describe("toEmitOnRoot", () => {
  describe("as a function which is registered to jest", () => {
    describe("returns true if the event is emitted", () => {
      it("by the synchronous function", () => {
        const wrapper = shallowMount(Component);
        const result = toEmitOnRoot(() => {
          wrapper.trigger("blur");
        }, wrapper, "blured") as MatcherResult;
        expect(result.pass).toBe(true);
        expect(result.message()).toBe('The function emitted the "blured" event on $root');
      });

      it("by the asynchronous function", async () => {
        const wrapper = shallowMount(Component);
        const result = await toEmitOnRoot(async () => {
          return doAsyncronously(() => {
            wrapper.trigger("blur");
          });
        }, wrapper, "blured");
        expect(result.pass).toBe(true);
        expect(result.message()).toBe('The function emitted the "blured" event on $root');
      });
    });

    describe("returns false if the event is not emitted", () => {
      it("by the synchronous function", () => {
        const wrapper = shallowMount(Component);
        const result = toEmitOnRoot(() => { /* nothing to do */ }, wrapper, "blured") as MatcherResult;
        expect(result.pass).toBe(false);
        expect(result.message()).toBe('The function did not emit the "blured" event on $root');
      });

      it("by the asynchronous function", async () => {
        const wrapper = shallowMount(Component);
        const result = await toEmitOnRoot(async () => "nothing to do", wrapper, "blured");
        expect(result.pass).toBe(false);
        expect(result.message()).toBe('The function did not emit the "blured" event on $root');
      });
    });

    describe("returns false if the event is emitted before", () => {
      it("by the synchronous function", () => {
        const wrapper = shallowMount(Component);
        wrapper.trigger("blur");
        const result = toEmitOnRoot(() => { /* "nothing to do" */ }, wrapper, "blured") as MatcherResult;
        expect(result.pass).toBe(false);
        expect(result.message()).toBe('The function did not emit the "blured" event on $root');
      });

      it("by the asynchrounous function", async () => {
        const wrapper = shallowMount(Component);
        wrapper.trigger("blur");
        const result = await toEmitOnRoot(async () => "nothing to do", wrapper, "blured");
        expect(result.pass).toBe(false);
        expect(result.message()).toBe('The function did not emit the "blured" event on $root');
      });
    });

    describe("with payload", () => {
      describe("when the event is emitted but the payloads is not matched", () => {
        const subject = () => {
          const wrapper = shallowMount(Component);
          return toEmitOnRoot(() => {
            emitEventOnRoot(wrapper, "rooty", { value: "something" });
            emitEventOnRoot(wrapper, "rooty", { value: "another something" });
          }, wrapper, "rooty", { value: "expected" }) as MatcherResult;
        };

        it("returns false", () => {
          expect(subject().pass).toBe(false);
        });

        it("tells the reason", () => {
          expect(subject().message()).toContain('The function emitted the \"rooty\" event on $root, but the payload is not matched');
        });

        it("shows the diff of payloads", () => {
          const message = subject().message();
          expect(message).toContain("'rooty' event #0 payloads:");
          expect(message).toContain('+     "value": "something"');
          expect(message).toContain("'rooty' event #1 payloads:");
          expect(message).toContain('+     "value": "another something"');
          expect(message.match(/- Expected/g)).toHaveLength(2);
          expect(message.match(/\+ Emitted/g)).toHaveLength(2);
          expect(message.match(/-     "value": "expected"/g)).toHaveLength(2);
        });
      });
    });
  });

  describe("actual use", () => {
    describe("passes positively when the expected event is emitted by the function", () => {
      it("synchronously", () => {
        const wrapper = shallowMount(Component);
        expect(() => wrapper.trigger("blur")).toEmitOnRoot(wrapper, "blured");
      });

      it("asynchronously", async () => {
        const wrapper = shallowMount(Component);
        return expect(async () => wrapper.trigger("blur")).toEmitOnRoot(wrapper, "blured");
      });
    });

    describe("passes negatively when the expected event is not emitted by the function", () => {
      it("synchronously", () => {
        const wrapper = shallowMount(Component);
        expect(() => { /* nothing to do */ }).not.toEmitOnRoot(wrapper, "blured");
      });

      it("asynchronously", async () => {
        const wrapper = shallowMount(Component);
        return expect(async () => "nothing to do").not.toEmitOnRoot(wrapper, "blured");
      });
    });

    describe("passes negatively when the expected event is emitted before the function", () => {
      it("synchronously", () => {
        const wrapper = shallowMount(Component);
        wrapper.trigger("blur")
        expect(() => { /* nothing to do */ }).not.toEmitOnRoot(wrapper, "blured");
      });

      it("asynchronously", async () => {
        const wrapper = shallowMount(Component);
        wrapper.trigger("blur")
        return expect(async () => "nothing to do").not.toEmitOnRoot(wrapper, "blured");
      });
    });

    describe("with payload", () => {
      describe("passes positively when the expected event is emitted with the payload by the function", () => {
        it("synchronously", () => {
          const wrapper = shallowMount(Component);
          expect(() => {
            emitEventOnRoot(wrapper, "rooty", { value: "something" });
          }).toEmitOnRoot(wrapper, "rooty", { value: "something" });
        });

        it("asynchronously", async () => {
          const wrapper = shallowMount(Component);
          return expect(async () => {
            return doAsyncronously(() => {
              emitEventOnRoot(wrapper, "rooty", { value: "something" });
            });
          }).toEmitOnRoot(wrapper, "rooty", { value: "something" });
        });
      });

      describe("passes positively when the expected event is emitted with the payload by the function after emitted the same event with another payload", () => {
        it("synchronously", () => {
          const wrapper = shallowMount(Component);
          emitEventOnRoot(wrapper, "rooty", { value: "something" });
          expect(() => {
            emitEventOnRoot(wrapper, "rooty", { value: "something" });
          }).toEmitOnRoot(wrapper, "rooty", { value: "something" });
        });

        it("asynchronously", async () => {
          const wrapper = shallowMount(Component);
          emitEventOnRoot(wrapper, "rooty", { value: "something" });
          return expect(async () => {
            return doAsyncronously(() => {
              emitEventOnRoot(wrapper, "rooty", { value: "something" });
            });
          }).toEmitOnRoot(wrapper, "rooty", { value: "something" });
        });
      });

      describe("passes negatively when the expected event is not emitted by the function", () => {
        it("synchronously", () => {
          const wrapper = shallowMount(Component);
          emitEventOnRoot(wrapper, "rooty", { value: "something" });
          expect(() => {
            // nothing to do
          }).not.toEmitOnRoot(wrapper, "rooty", { value: "something" });
        });

        it("asynchronously", async () => {
          const wrapper = shallowMount(Component);
          emitEventOnRoot(wrapper, "rooty", { value: "something" });
          return expect(async () => {
            // nothing to do
          }).not.toEmitOnRoot(wrapper, "rooty", { value: "something" });
        });
      });

      describe("passes negatively when the expected event is emitted by the function, but the payload is not matched", () => {
        it("synchronously", () => {
          const wrapper = shallowMount(Component);
          expect(() => {
            emitEventOnRoot(wrapper, "rooty", { value: "another something" });
          }).not.toEmitOnRoot(wrapper, "rooty", { value: "something" });
        });

        it("asynchronously", async () => {
          const wrapper = shallowMount(Component);
          return expect(async () => {
            return doAsyncronously(() => {
              emitEventOnRoot(wrapper, "rooty", { value: "another something" });
            });
          }).not.toEmitOnRoot(wrapper, "rooty", { value: "something" });
        });
      });

      describe("multiple payloads", () => {
        describe("passes positively when the expected event is emitted with the multiple payloads by the function", () => {
          it("synchronously", () => {
            const wrapper = shallowMount(Component);
            expect(() => {
              (wrapper.vm as any).emitEventOnRootWithMultiplePayload("multiOnRoot!");
            }).toEmitOnRoot(wrapper, "multiOnRoot!", ["D"], 3, "e");
          });

          it("asynchronously", async () => {
            const wrapper = shallowMount(Component);
            return expect(async () => {
              return doAsyncronously(() => {
                (wrapper.vm as any).emitEventOnRootWithMultiplePayload("multiOnRoot!");
              })
            }).toEmitOnRoot(wrapper, "multiOnRoot!", ["D"], 3, "e");
          });
        });

        describe("passes positively for expect helper to assert with 'anything'", () => {
          it("synchronously", () => {
            const wrapper = shallowMount(Component);
            expect(() => {
              (wrapper.vm as any).emitEventOnRootWithMultiplePayload("multiOnRoot!");
            }).toEmitOnRoot(wrapper, "multiOnRoot!", expect.arrayContaining(["D"]), expect.anything(), "e");
          });

          it("asynchronously", async () => {
            const wrapper = shallowMount(Component);
            return expect(async () => {
              return doAsyncronously(() => {
                (wrapper.vm as any).emitEventOnRootWithMultiplePayload("multiOnRoot!");
              });
            }).toEmitOnRoot(wrapper, "multiOnRoot!", expect.arrayContaining(["D"]), expect.anything(), "e");
          });
        });

        describe("passes negatively when the number of paylod is shorter than actual (even they are matching)", () => {
          it("synchronously", () => {
            const wrapper = shallowMount(Component);
            expect(() => {
              (wrapper.vm as any).emitEventOnRootWithMultiplePayload("multiOnRoot!");
            }).not.toEmitOnRoot(wrapper, "multiOnRoot!", ["D"], 3);
          });

          it("asynchronously", async () => {
            const wrapper = shallowMount(Component);
            return expect(async () => {
              return doAsyncronously(() => {
                (wrapper.vm as any).emitEventOnRootWithMultiplePayload("multiOnRoot!");
              });
            }).not.toEmitOnRoot(wrapper, "multiOnRoot!", ["D"], 3);
          });
        });

        describe("passes negatively when the number of paylod is longer", () => {
          it("synchronously", () => {
            const wrapper = shallowMount(Component);
            expect(() => {
              (wrapper.vm as any).emitEventOnRootWithMultiplePayload("multiOnRoot!");
            }).not.toEmitOnRoot(wrapper, "multiOnRoot!", ["D"], 3, "e", "extra");
          });

          it("asynchronously", async () => {
            const wrapper = shallowMount(Component);
            return expect(async () => {
              return doAsyncronously(() => {
                (wrapper.vm as any).emitEventOnRootWithMultiplePayload("multiOnRoot!");
              });
            }).not.toEmitOnRoot(wrapper, "multiOnRoot!", ["D"], 3, "e", "extra");
          });
        });
      });
    });
  });
});
