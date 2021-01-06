
//#region - Type Definitions
type EventListener = (data?: any) => void;

/** shim that tries to match the ts's builtin `enum` type */
type Enum = {[key: string]: string};
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
    
    if (hasEvents) {
      // initialize with empty array...
      // The array will be used to store the event listeners
      this.events[eventKey] = [];
    };

    this.events[eventKey].push(listener);
  };

  removeListener(eventKey: EventsT, listenerToRemove: EventListener) {
    // event does not exist (maybe: throw an error?)
    if (!this.events[eventKey]) return;

    this.events[eventKey] = this.events[eventKey].filter(listener => (
      listener !== listenerToRemove
    ));
  };

  once(eventKey: EventsT, listener: EventListener){
    this.addListener(eventKey, (data) => {
      listener(data);
      this.removeListener(eventKey, listener);
    });
  };

  removeAllListeners(){
    this.events = {};
  };

  emit(eventKey: EventsT, data: any) {
    // event does not exist
    if (!this.events[eventKey]) return;

    this.events[eventKey].forEach(callback => {
      callback(data);
    });
  };
};