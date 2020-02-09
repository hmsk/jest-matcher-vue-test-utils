import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from 'rollup-plugin-json';
import cleanup from 'rollup-plugin-cleanup';

import pkg from "./package.json";

export default {
  input: "./src/index.ts",

  plugins: [
    resolve(),
    commonjs({
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        'node_modules/@vue/test-utils/dist/vue-test-utils.js': [ 'shallowMount' ]
      }
    }),
    typescript({
      clean: true,
      useTsconfigDeclarationDir: true
    }),
    json(),
    cleanup()
  ],

  output: {
    file: pkg.main,
    format: "cjs",
    exports: "named"
  },

  external: [
    "@vue/test-utils",
    "expect/build/jasmineUtils",
    "jest-diff",
    "jest-util"
  ]
}
