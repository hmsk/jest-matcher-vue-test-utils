# jest-matcher-vue-test-utils

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
expect(Component).toRequireProp("name"); // Passes
expect(Component).toRequireProp("birthday"); // Fails
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

## License

MIT, Copyright (c) 2018 Kengo Hamasaki
