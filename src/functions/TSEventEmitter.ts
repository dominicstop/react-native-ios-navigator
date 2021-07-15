import type { EnumString } from "../types/UtilityTypes";

type EventListener<T> = T extends (null | undefined) 
  ? () => void : (data: T) => void;

/**
 * ```
 * // Create a string enum
 * enum TestEnum { Foo = 'Foo', Bar = 'Bar' };
 * 
 * // For each key in the event enum, create a map that defines 
 * // the type of event param. the event listener will receive...
 * export const emitter: EventEmitter<typeof TestEnum, {
 * 
 *  // For the event `TestEnum.Foo`, it will receive this type.
 *  Foo: { name: string },
 * 
 *  // `null` or `undefined` means event listener receives no params
 *  Bar: null, 
 *  
 *  // alt. you can directly use the enum as a key...
 *  // TS will infer (and suggest) all the possible keys whichever 
 *  // way you choose.
 *  [TestEnum.Baz]: Array<number>,
 * }> = new EventEmitter();
 * 
 * // `event` will be inferred as `(event: { name: string }) => void`
 * emitter.once('Foo', (event) => { console.log(event.name) });
 * 
 * // `event` will be inferred as `() => void`
 * emitter.once('Bar', () => { ... });
 * 
 * // `event` will be inferred as `(event: number[]) => void`
 * emitter.once(TestEnum.Baz, (event) => { console.log(number) });
 * ```
 */
export class TSEventEmitter<
  TEnum extends EnumString, 
  TEventMap extends { [K in keyof Required<TEnum>]: any }
> {
  // Properties
  /** Store the event listeners */
  private listeners: { 
    [K in keyof TEnum]?: Array<EventListener<TEventMap[K]>> 
  };
  
  constructor() {
    this.listeners = {};
  };

  addListener<K extends keyof TEnum>(eventKey: K, listener: EventListener<TEventMap[K]>) {
    const hasListener = this.listeners[eventKey] != null;
    
    if (!hasListener) {
      // initialize with empty array...
      // The array will be used to store the event listeners
      this.listeners[eventKey] = [];
    };

    this.listeners[eventKey].push(listener);

    return {
      unsubscribe: () => {
        this.removeListener(eventKey, listener);
      }
    };
  };

  removeListener<K extends keyof TEnum>(eventKey: K, listenerToRemove: EventListener<TEventMap[K]>) {
    const hasListener = this.listeners[eventKey] != null;

    // event does not exist (maybe: throw an error?)
    if (!hasListener) return;

    this.listeners[eventKey] = this.listeners[eventKey].filter(listener => (
      listener !== listenerToRemove
    ));
  };

  once<K extends keyof TEnum>(eventKey: K, listener: EventListener<TEventMap[K]>){
    const tempListener = (data?: any) => {
      listener(data);
      this.removeListener(eventKey, tempListener);
    };

    this.addListener(eventKey, tempListener);
  };

  removeAllListeners(){
    this.listeners = {};
  };

  emit<K extends keyof TEnum>(eventKey: K, data: TEventMap[K]) {
    const hasListener = this.listeners[eventKey] != null;

    // event does not exist
    if (!hasListener) return;

    this.listeners[eventKey].forEach(callback => {
      callback(data);
    });
  };
};

