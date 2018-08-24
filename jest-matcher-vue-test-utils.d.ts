declare type ComponentOptions = import("./src/main").MatcherComponentOptions<import("vue").default>;
declare namespace jest {
  interface Matchers<R> {
    toRequireProp (prop: string, options?: ComponentOptions): R;
    toHaveDefaultProp (prop: string, defaultValue: any, options?: ComponentOptions): R;
    toTypeProp (prop: string, type: any | any[], options?: ComponentOptions): R;
    toClaimProp (prop: string, sampleValue: any, options?: ComponentOptions): R;
  }
}
