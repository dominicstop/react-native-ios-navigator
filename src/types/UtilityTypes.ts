


/** Tries to match the TS's builtin string `enum` type (e.g. `typeof Enum`) */
export type EnumString = Readonly<{ [key: string]: string }>;

/** 
 * Accepts a value from `TEnum` as an enum key (e.g. `Enum.Foo`), 
 * or as a string literal (e.g. 'Foo').
 * 
 * ### Example
 * ```
 * let x: EnumValuesLiteral<Enum>;
 * 
 * x = Enum.Foo;
 * x = Enum.Bar;
 * 
 * x = 'Foo';
 * x = 'Bar';
 * ```
 */
export type EnumValuesLiteral
  <TEnum extends string> = TEnum | `${TEnum}`;

/**
 * Accepts a specific key from `TEnum` (e.g. `Enum.Foo | 'Foo'`) either as a enum key (e.g. `Enum.Foo`), 
 * or as a string literal (e.g. 'Foo').
 * 
 * ### Example
 * ```
 * let x: EnumValueLiteral<typeof Enum, 'Foo'>;
 * 
 * x = Enum.Foo;
 * x = 'Foo';
 * 
 * x = Enum.Bar // error
 * x = 'Bar' // error
 * ```
 */
export type EnumValueLiteral
  <TEnum extends EnumString, TKey extends keyof TEnum> = TKey | TEnum[TKey];
