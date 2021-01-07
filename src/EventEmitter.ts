
//#region - Type Definitions
type EventListener = (data?: any) => void;

/** shim that tries to match the ts's builtin `enum` type */
export type Enum = {[key: string]: string};
//#endregion

export class EventEmitter<EventsT extends keyof Enum> {
  // Properties
  /** Store the event listeners */
  private events: { [key: string]: Array<EventListener> };
  
  constructor() {
    this.events = {};
  };

  addListener(eventKey: EventsT, listener: EventListener) {
    const hasEvents = this.events[eventKey] != null;
    
    if (!hasEvents) {
      // initialize with empty array...
      // The array will be used to store the event listeners
      this.events[eventKey] = [];
    };

    this.events[eventKey].push(listener);
  };

  removeListener(eventKey: EventsT, listenerToRemove: EventListener) {
    const hasEvents = this.events[eventKey] != null;

    // event does not exist (maybe: throw an error?)
    if (!hasEvents) return;

    this.events[eventKey] = this.events[eventKey].filter(listener => (
      listener !== listenerToRemove
    ));
  };

  once(eventKey: EventsT, listener: EventListener){
    const tempListener: EventListener = (data) => {
      listener(data);
      this.removeListener(eventKey, tempListener);
    };

    this.addListener(eventKey, tempListener);
  };

  removeAllListeners(){
    this.events = {};
  };

  emit(eventKey: EventsT, data: any) {
    const hasEvents = this.events[eventKey] != null;

    // event does not exist
    if (!hasEvents) return;

    this.events[eventKey].forEach(callback => {
      callback(data);
    });
  };
};