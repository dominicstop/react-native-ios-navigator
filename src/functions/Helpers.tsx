import type React from 'react';

// wrapper func for setState that returns a promise
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

// wrapper for timeout that returns a promise
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

export function isClassComponent(component) {
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