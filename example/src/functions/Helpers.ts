
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

export function hexToRGBA(hex: string, alpha = 1, offset = 0) {
  const r = parseInt(hex.slice(1, 3), 16) + offset;
  const g = parseInt(hex.slice(3, 5), 16) + offset;
  const b = parseInt(hex.slice(5, 7), 16) + offset;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

//The maximum is exclusive and the minimum is inclusive
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
};

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};