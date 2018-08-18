import typescript from "rollup-plugin-typescript2";

export default {
  input: "./src/main.ts",

  plugins: [
    typescript()
  ],

  output: {
    file: "index.js",
    format: "cjs"
  }
}
