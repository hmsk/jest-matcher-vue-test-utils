declare namespace jest {
  interface Matchers<R> {
    toRequireProp (prop: string): R;
  }
}
