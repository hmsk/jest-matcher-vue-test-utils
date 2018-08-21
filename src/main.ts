import { shallowMount, VueClass } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';

declare type MatcherResult = { message (): string, pass: boolean };

export function toRequireProp<V extends Vue> (
  received: VueClass<V> | ComponentOptions<V>,
  propName: string
): MatcherResult {
  const original = console.error;
  console.error = jest.fn();

  shallowMount(received);
  const found = (console.error as jest.Mock).mock.calls.find((c) => {
    return c.find((arg: string) => arg.includes(`Missing required prop: "${propName}"\n`))
  });

  console.error = original;

  return {
    message: !!found ?
      () => `'${propName}' prop is claimed as required` :
      () => `'${propName}' prop is not claimed as required`,
    pass: !!found
  };
}

const matchers = {
  toRequireProp
};

export default matchers;
