
export function randomElement<T = any>(items: Array<T>){
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
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

export function nextItemInCyclicArray<T>(index: number, array: Array<T>): T {
  return array[index % array.length];
};
