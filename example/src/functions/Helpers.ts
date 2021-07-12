
export function randomElement<T = any>(items: Array<T>){
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

// wrapper for timeout that returns a promise
export function timeout(ms: number) {
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

export function hexToRGBA(hex: string, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};