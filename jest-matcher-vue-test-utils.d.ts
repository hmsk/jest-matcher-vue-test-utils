declare type ComponentOptions = import("./src/main").MatcherComponentOptions<import("vue").default>;
declare namespace jest {
  interface Matchers<R> {
    toRequireProp (prop: string, options?: ComponentOptions): R;
    toHaveDefaultProp (prop: string, defaultValue: any, options?: ComponentOptions): R;
    toBeValidProps (props: any, options?: ComponentOptions): R;
    toBeValidProp (prop: string, sampleValue: any, options?: ComponentOptions): R;
    toBeValidPropWithTypeCheck (prop: string, type: any | any[], options?: ComponentOptions): R;
    toBeValidPropWithCustomValidator (prop: string, sampleValue: any, options?: ComponentOptions): R;
  }
}
