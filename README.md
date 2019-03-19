# jest-matcher-vue-test-utils

[![npm](https://img.shields.io/npm/v/jest-matcher-vue-test-utils.svg?style=for-the-badge)](https://www.npmjs.com/package/jest-matcher-vue-test-utils)
[![CircleCI](https://img.shields.io/circleci/project/github/hmsk/jest-matcher-vue-test-utils/master.svg?style=for-the-badge)](https://circleci.com/gh/hmsk/jest-matcher-vue-test-utils)

Cute matchers for [Jest](https://facebook.github.io/jest) to test Vue components with [Vue Test Utils](https://vue-test-utils.vuejs.org/).

# Installation

Get from npm:

```sh
$ npm install -D jest-matcher-vue-test-utils
```

Then, register matchers on your jest process:

```js
import vueTestUtilMatchers from "jest-matcher-vue-test-utils";
expect.extend({ ...vueTestUtilMatchers });
```

# Provided Matchers

Matcher|What's asserted|Quick sample
---|---|---
Existence on Wrapper||
`toShow`|Function shows a content on Wrapper|`expect(() => wrapper.vm.showError()).toShow(wrapper, "p.error")`
`toHide`|Function hides a content on Wrapper|`expect(() => wrapper.vm.hideError()).toHide(wrapper, "p.error");`
Events on Wrapper||
`toEmit`|Function emits the event on Wrapper|`expect(() => wrapper.trigger("click")).toEmit(wrapper, "special")`
`toHaveEmitted`|Wrapper has emitted an event|`expect(wrapper).toHaveEmitted("special")`
Vuex actions/mutations ||
`toDispatch`|Function dispatches Vuex action on a component|`expect(() => somethingAwesome()).toDispatch(wrapper, "awesomeAction")`
`toHaveDispatched`|Component has dispatched Vuex action|`expect(wrapper).toHaveDispatched("awesomeAction")`
`toCommit`|Function commits the Vuex mutation on a component|`expect(() => somethingAwesome()).toCommit(wrapper, "awesomeMutation")`
Prop validations ||
`toBeValidProps`|All props are valid|`expect(Component).toBeValidProps({ name: "required name", fullName: "Kengo Hamasaki" })`
`toBeValidProp`|Single prop is valid|`expect(Component).toBeValidProp("name", "Required Name")`
`toRequireProp`|Single prop is required|`expect(Component).toRequireProp("name")`
`toHaveDefaultProp`|Single prop has a default|`expect(Component).toHaveDefaultProp("address", "Kitakyushu, Japan")`
`toBeValidPropWithTypeCheck`|Single prop is valid for type|`expect(Component).toBeValidPropWithTypeCheck("zipcode", "94103")`
`toBeValidPropWithCustomValidator`|Single props is valid for custom validator|`expect(Component).toBeValidPropWithCustomValidator("fullname", "Kengo Hamasaki")`

## Further details

### Existence on Wrapper

#### `toShow`

<details>
  <summary>Assert the function shows a content on Wrapper of vue-test-utils</summary>

```js
// error-message.vue
<template>
  <div>
    <p v-if="isError" class="error">message</p>
  </div>
</template>

...

data: function () {
  return {
    isError: false
  }
},
methods: {
  showError () {
    this.isError = true;
  }
}
```

```js
import Component from "./error-message.vue";

it("show error by showError", () => {
  expect(() => wrapper.vm.showError()).toShow(wrapper, "p.error"); // Passes
});
```
</details>

#### `toHide`

<details>
  <summary>Assert the function hides a content on Wrapper of vue-test-utils</summary>

```js
// error-message.vue
<template>
  <div>
    <p v-if="isError" class="error">message</p>
  </div>
</template>

...

data: function () {
  return {
    isError: true
  }
},
methods: {
  hideError () {
    this.isError = false;
  }
}
```

```js
import Component from "./error-message.vue";

it("show error by showError", () => {
  expect(() => wrapper.vm.hideError()).toHide(wrapper, "p.error"); // Passes
});
```

</details>

### Events on Wrapper

#### `toEmit`

<details>
  <summary>Assert the action emits the event (with the payload optionally) on Wrapper of vue-test-utils</summary>

```js
// event.vue
<template>
  <div @click="emitEvent('clicked')">
    Click Me
  </div>
</template>

<script>
module.exports = {
  methods: {
    emitEvent (e) {
      this.$emit("special", e);
    }
  }
}
</script>
```

```js
import Component from "./event.vue";

it("emits special event by click", () => {
  const wrapper = shallowMount(Component);
  expect(() => wrapper.trigger("click")).toEmit(wrapper, "special"); // Passes
  expect(() => wrapper.trigger("click")).toEmit(wrapper, "special", "clicked"); // Passes
});
```

</details>

#### `toHaveEmitted`

<details>
  <summary>Assert the event is emitted (with the payload optionally) on Wrapper of vue-test-utils</summary>

```js
// event.vue
<template>
  <div @click="emitEvent('clicked')">
    Click Me
  </div>
</template>

<script>
module.exports = {
  methods: {
    emitEvent (e) {
      this.$emit("special", e);
    }
  }
}
</script>
```

```js
import Component from "./event.vue";

it("emits special event by click", () => {
  const wrapper = shallowMount(Component);
  wrapper.trigger("click");
  expect(wrapper).toHaveEmitted("special"); // Passes
  expect(wrapper).toHaveEmitted("special", "clicked"); // Passes
});
```
</details>

### Vuex actions/mutations

#### `toDispatch`

<details>
<summary>Assert the function dispatches Vuex action on the component</summary>

```js
// click-store.vue
<template>
  <div @click="dispatchStore('click')">
    Click Me
  </div>
</template>

<script>
module.exports = {
  methods: {
    dispatchStore (e) {
      this.$store.dispatch('awesomeAction', e);
    }
  }
}
</script>
```

```js
import Component from "./click-store.vue";

it("Dispatches the action on store by click", () => {
  const wrapper = shallowMount(Component)  expect(() => {
    wrapper.trigger("click");
  }).toDispatch(wrapper, "awesomeAction"); // Passes

  expect(() => {
    wrapper.trigger("click");
  }).toDispatch(wrapper, "awesomeAction", 'click'); // Passes
});
```
</details>

#### `toCommit` (TBD)

<details>
<summary>Assert the store mutation is committed</summary>

```js
// click-store.vue
<template>
  <div @click="commitStore('click')">
    Click Me
  </div>
</template>

<script>
module.exports = {
  methods: {
    commitStore (e) {
      this.$store.commit('importantMutation', e);
    }
  }
}
</script>
```

```js
import Component from "./click-store.vue";

it("Commits the mutation on store by click", () => {
  const wrapper = shallowMount(Component);
  expect(() => {
    wrapper.trigger("click");
  }).toCommit(wrapper, "importantMutation"); // Passes

  expect(() => {
    wrapper.trigger("click");
  }).toCommit(wrapper, "importantMutation", 'click'); // Passes
});
```
</details>

#### `toHaveDispatched`

<details>
<summary>Assert a component has dispatched Vuex action</summary>

```js
// click-store.vue
<template>
  <div @click="dispatchStore('click')">
    Click Me
  </div>
</template>

<script>
module.exports = {
  methods: {
    dispatchStore (e) {
      this.$store.dispatch('awesomeAction', e);
    }
  }
}
</script>
```

```js
import Component from "./click-store.vue";
import { vuexPlugin } from jest-matcher-vue-test-utils";

it("Dispatches the action on store by click", () => {
  const store = new Vuex.Store({
    actions: dispatchStore() {},
    plugins: [vuexPlugin()] // Requires adding plugin to use `toHaveDispatched` matcher
  });

  const wrapper = shallowMount(Component, { store })
  wrapper.trigger("click");
  expect(wrapper).toHaveDispatched("awesomeAction"); // Passes
  expect(wrapper).toHaveDispatched("awesomeAction", "click"); // Passes
});
```
</details>

### Prop Validations

#### `toBeValidProps`

<details>
  <summary>Assert that a prop set is valid for a component</summary>

```js
// name-require-and-fullname-is-validated-component.vue
props: {
  name: {
    type: String,
    required: true
  }
  fullname: {
    validator: function (val) {
      return !!val && val.match(/.+\s.+/);
    }
  }
}
```

```js
import Component from "./name-require-and-fullname-is-validated-component.vue";

it("component validates props", () => {
  expect(Component).toBeValidProps({ name: "required name", fullName: "Kengo Hamasaki" }); // Passes
  expect(Component).toBeValidProps({ fullName: "Kengo Hamasaki" }); // Fails
  expect(Component).toBeValidProps({ name: "required name", fullName: "Kengo" }); // Fails
});
```
</details>

#### `toBeValidProp`

<details>
  <summary>Assert that a single prop is valid for a component</summary>

```js
// name-require-component.vue
props: {
  name: {
    type: String,
    required: true
  }
}
```

```js
import Component from "./name-require-component.vue";

it("component validates props", () => {
  expect(Component).toBeValidProp("name", "Required Name"); // Passes
  expect(Component).toBeValidProp("name", null); // Fails as required
  expect(Component).toBeValidProp("name", 123}); // Fails as typecheck
});
```
</details>



#### `toRequireProp`

<details>
  <summary>Assert that a component requires a prop</summary>

```js
// name-require-component.vue
props: {
  name: {
    type: String,
    required: true
  }
}
```

```js
import Component from "./name-require-component.vue";

it("component requires name prop", () => {
  expect(Component).toRequireProp("name"); // Passes
  expect(Component).toRequireProp("birthday"); // Fails
});
```
</details>

#### `toHaveDefaultProp`

<details>
  <summary>Assert that a component gives default to a prop</summary>

```js
// default-address-component.vue
props: {
  address: {
    type: String,
    default: "Kitakyushu, Japan"
  }
}
```

```js
import Component from "./default-address-component.vue";

it("component gives default value for address prop", () => {
  expect(Component).toHaveDefaultProp("address", "Kitakyushu, Japan"); // Passes
  expect(Component).toHaveDefaultProp("address", "San Francisco, US"); // Fails
});
```
</details>

#### `toBeValidPropWithTypeCheck`

<details>
  <summary>Assert that a component validates a prop with type</summary>

```js
// takes-zipcode-component.vue
props: {
  zipcode: {
    type: String
  }
}
```

```js
import Component from "./takes-zipcode-component.vue";

it("component validates zipcode prop", () => {
  expect(Component).toBeValidPropWithTypeCheck("zipcode", "94103"); // Passes
  expect(Component).toBeValidPropWithTypeCheck("zipcode", 94103); // Fails
});
```
</details>

#### `toBeValidPropWithCustomValidator`

<details>
  <summary>Assert that a component validates a prop with custom validator</summary>

```js
// fullname-is-validated-component.vue
props: {
  fullname: {
    validator: function (val) {
      return !!val && val.match(/.+\s.+/);
    }
  }
}
```

```js
import Component from "./fullname-is-validated-component.vue";

it("component validates fullname prop", () => {
  expect(Component).toBeValidPropWithCustomValidator("fullname", "Kengo Hamasaki"); // Passes
  expect(Component).toBeValidPropWithCustomValidator("fullname", "Kengo"); // Fails
});
```
</details>

# Config

We can configure the matchers. Currently accepting *mountOptions* property to give options for `shallowMount` which is running in inside of matchers.

```js
import vueTestUtilMatchers, { config } from "jest-matcher-vue-test-utils";
import { createLocalVue } from "@vue/test-utils";

config({
  mountOptions: { localVue: createLocalVue() }
});
```

# License

MIT, Copyright (c) 2018- Kengo Hamasaki
