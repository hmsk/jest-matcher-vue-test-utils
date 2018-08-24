declare namespace jest {
  interface Matchers<R> {
    toRequireProp (prop: string): R;
    toTypeProp (prop: string, type: any | any[]): R;
    toHaveDefaultProp (prop: string, defaultValue: any): R;
    toClaimProp (prop: string, sampleValue: any): R;
  }
}
