
import type { DynamicColor } from 'src/types/MiscTypes';


export function compareColor<T extends string | DynamicColor>(a: T, b: T){
  if(typeof a === 'object' && typeof b === 'object'){
    a as DynamicColor; 
    b as DynamicColor;

    return(
      (a.dynamic.dark  === b.dynamic.dark ) &&
      (a.dynamic.light === b.dynamic.light) 
    );
  };

  return a === b;
};