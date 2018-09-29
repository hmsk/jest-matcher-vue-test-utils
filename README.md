# jest-matcher-vue-test-utils

[![npm](https://img.shields.io/npm/v/jest-matcher-vue-test-utils.svg?style=for-the-badge)](https://www.npmjs.com/package/jest-matcher-vue-test-utils)
[![CircleCI](https://img.shields.io/circleci/project/github/hmsk/jest-matcher-vue-test-utils.svg?style=for-the-badge)](https://circleci.com/gh/hmsk/jest-matcher-vue-test-utils)

Cute matchers for [Jest](https://facebook.github.io/jest)  to test Vue components with `@vue/test-utils`.

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

# Matchers

## For Wrapper Contents

### `toShow`

<details>
  <summary>Assert the action shows a content on Wrapper of vue-test-utils</summary>

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

### `toDisappear`

<details>
  <summary>Assert disappears content by action</summary>

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
  dismissError () {
    this.isError = false;
  }
}
```

```js
import Component from "./error-message.vue";

it("show error by showError", () => {
  expect(() => wrapper.vm.dismissError()).toDisappear(wrapper, "p.error"); // Passes
});
```

</details>

## For Prop Validations

### `toBeValidProps`

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

### `toBeValidProp`

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



### `toRequireProp`

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

### `toHaveDefaultProp`

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

### `toBeValidPropWithTypeCheck`

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

### `toBeValidPropWithCustomValidator`

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

MIT, Copyright (c) 2018 Kengo Hamasaki
