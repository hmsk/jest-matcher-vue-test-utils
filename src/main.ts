import { Component } from '@vue/test-utils';

declare type MatcherResult = { message(): string | (() => string), pass: boolean } | Promise<{ message(): string, pass: boolean }>;

export function toRequireProp (received: Component, propName: string): MatcherResult {
  return { message: () => "it's message from matcher", pass: propName == "hello" };
}

const matchers = {
  toRequireProp
};

export default matchers;
