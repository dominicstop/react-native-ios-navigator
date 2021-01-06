import type React from 'react';

//wrapper func for setState that returns a promise
export function setStateAsync<T>(
  that: React.Component,
  newState: T | ((prevState: T) => T)
) {
  return new Promise((resolve) => {
    that.setState(newState, () => {
      resolve(null);
    });
  });
};

//wrapper for timeout that returns a promise
export function timeout(ms: Number) {
  return new Promise(resolve => {
    const timeoutID = setTimeout(() => {
      clearTimeout(timeoutID);
      resolve(null);
    }, ms)
  });
};