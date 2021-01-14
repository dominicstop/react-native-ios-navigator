
export function randomElement<T = any>(items: Array<T>){
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};