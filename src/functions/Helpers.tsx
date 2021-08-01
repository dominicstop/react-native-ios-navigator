import type React from 'react';
import { findNodeHandle } from 'react-native';

import type { Nullish } from '../types/UtilityTypes';


/** wrapper func for setState that returns a promise */
// eslint-disable-next-line consistent-this
export function setStateAsync<T>(
  that: React.Component,
  newState: T | ((prevState: T) => T)
){
  return new Promise<void>((resolve) => {
    that.setState(newState, () => {
      resolve();
    });
  });
};

/** wrapper for timeout that returns a promise */
export function timeout(ms: Number) {
  return new Promise<void>(resolve => {
    const timeoutID = setTimeout(() => {
      clearTimeout(timeoutID);
      resolve();
    }, ms)
  });
};

/** Wraps a promise that will reject if not not resolved in <ms> milliseconds */
export function promiseWithTimeout<T>(ms: Number, promise: Promise<T>){
  // Create a promise that rejects in <ms> milliseconds
  const timeoutPromise = new Promise<T>((_, reject) => {
    const timeoutID = setTimeout(() => {
      clearTimeout(timeoutID);
      reject(`Promise timed out in ${ms} ms.`)
    }, ms);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([promise, timeoutPromise]);
};

export function isClassComponent(component: any) {
  return !!(
    typeof component === 'function'
    && component?.prototype?.isReactComponent
  );
};

export function lastElement<T>(array: Array<T>): T | undefined {
  if(!array) return undefined;
  return array[array.length - 1];
};

export function arrayInsert<T>(array: Array<T>, index: number, newItem: T){
  return [
    // part of the array before the specified index
    ...array.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...array.slice(index)
  ];
};

export function addOptional
  <T extends object, U extends object>(a: T, b: U | null): T & Partial<U> {
    
  return {...a, ...b};
};

export function shallowMergeObjects<T extends object>(
  a: Nullish<T>,
  b: Nullish<T>
): T | null {
  if     (a == null && b == null) return null;
  else if(a != null && b == null) return a;
  else if(a == null && b != null) return b;
  else return { ...a, ...b } as T;
};

export function getNativeNodeHandle(nativeRef: React.Component){
  const nodeHandle = findNodeHandle(nativeRef);

  if(nodeHandle == null){
    throw new Error('Unable to get the node handle for the native ref.');
  };

  return nodeHandle;
};