# jest-matcher-vue-test-utils

[![npm](https://img.shields.io/npm/v/jest-matcher-vue-test-utils.svg?style=for-the-badge)](https://www.npmjs.com/package/jest-matcher-vue-test-utils)
![CircleCI](https://img.shields.io/circleci/project/github/hmsk/jest-matcher-vue-test-utils.svg?style=for-the-badge)

Cute matchers for [Jest](https://facebook.github.io/jest)  to test Vue components with `@vue/test-utils`.

## Matchers

### `toRequireProp`

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

### `toHaveDefaultProp`

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

### `toClaimPropWithCustomValidator`

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
  expect(Component).toClaimPropWithCustomValidator("fullname", "Kengo Hamasaki"); // Passes
  expect(Component).toClaimPropWithCustomValidator("fullname", "Kengo"); // Fails
});
```

## Installation

Get from npm:

```sh
$ npm install -D jest-matcher-vue-test-utils
```

Then, register matchers on your jest process:

```js
import vueTestUtilMatchers from "jest-matcher-vue-test-utils";
expect.extend({ ...vueTestUtilMatchers });
```

## Config

We can configure the matchers. Currently accepting *mountOptions* property to give options for `shallowMount` which is running in inside of matchers.

```js
import vueTestUtilMatchers, { config } from "jest-matcher-vue-test-utils";
import { createLocalVue } from "@vue/test-utils";

config({
  mountOptions: { localVue: createLocalVue() }
});
```

## License

MIT, Copyright (c) 2018 Kengo Hamasaki
