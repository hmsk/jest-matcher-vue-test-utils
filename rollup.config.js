import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from 'rollup-plugin-json';

export default {
  input: "./src/main.ts",

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
    typescript(),
    json()
  ],

  output: {
    file: "index.js",
    format: "cjs"
  },

  external: ["@vue/test-utils"]
}
