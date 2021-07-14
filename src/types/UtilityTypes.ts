


/** Tries to match the TS's builtin string `enum` type (e.g. `typeof Enum`) */
export type EnumString = { [key: string]: string };

export type KeysOfUnion<T> = T extends T ? keyof T: never;

/** 
 * Accepts a value from `TEnum` as an enum key (e.g. `Enum.Foo`), 
 * or as a string literal (e.g. 'Foo').
 * 
 * ### Example
 * ```
 * enum E { Foo, Bar }
 * let x: EnumValuesLiteral<E>;
 * 
 * x = E.Foo;
 * x = E.Bar;
 * 
 * x = 'Foo';
 * x = 'Bar';
 * ```
 */
export type EnumValuesLiteral
  <TEnum extends string> = TEnum | `${TEnum}`;

/**
 * Accepts a specific key from `TEnum` either as a enum key (e.g. `Enum.Foo`), 
 * or as a string literal (e.g. 'Foo'). 
 * 
 * A less brittle way of writing `Enum.Foo | 'Foo'` (i.e. because the keys will be in sync
 * when renaming an enum entry, or error when given an invalid key). 
 * 
 * ### Example
 * ```
 * enum E { Foo, Bar }
 * let x: EnumValueLiteral<typeof E, 'Foo'>;
 * 
 * x = E.Foo;
 * x = 'Foo';
 * 
 * x = E.Bar // error
 * x = 'Bar' // error
 * 
 * let z: EnumValueLiteral<typeof E, 'Baz'>; // error
 * ```
 */
export type EnumValueLiteral
  <TEnum extends EnumString, TKey extends keyof TEnum> = TKey | TEnum[TKey];
