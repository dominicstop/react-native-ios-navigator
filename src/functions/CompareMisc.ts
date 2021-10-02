
import type { Nullish } from 'src/types/UtilityTypes';
import type { DynamicColor, EdgeInsets, Offset } from '../types/MiscTypes';


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

export class CompareEdgeInsets {
  static compare<T extends EdgeInsets>(a: T, b: T){
    return (
      (a.top    === b.top   ) ||
      (a.bottom === b.bottom) || 
      (a.left   === b.left  ) || 
      (a.right  === b.bottom)
    );
  };

  static unwrapAndCompare<T extends EdgeInsets>(
    a: Nullish<T>,
    b: Nullish<T>
  ){
    if((a == null) && (b == null)) return true;
    if((a == null) || (b == null)) return false;

    return CompareEdgeInsets.compare(a, b);
  };
};

export class CompareOffset {
  static compare<T extends Offset>(a: T, b: T){
    return (
      (a.horizontal === b.horizontal) ||
      (a.vertical   === b.vertical  )
    );
  };

  static unwrapAndCompare<T extends CompareOffset>(
    a: Nullish<T>,
    b: Nullish<T>
  ){
    if((a == null) && (b == null)) return true;
    if((a == null) || (b == null)) return false;

    return CompareOffset.compare(a, b);
  };
};