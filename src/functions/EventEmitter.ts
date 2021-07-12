import type { EnumString } from "../types/UtilityTypes";

type EventListener = (data?: any) => void;

export class EventEmitter<EventsT extends keyof EnumString> {
  // Properties
  /** Store the event listeners */
  private events: { [key: string]: Array<EventListener> };
  
  constructor() {
    this.events = {};
  };

  addListener(eventKey: EventsT | string, listener: EventListener) {
    const hasEvents = this.events[eventKey] != null;
    
    if (!hasEvents) {
      // initialize with empty array...
      // The array will be used to store the event listeners
      this.events[eventKey] = [];
    };

    this.events[eventKey].push(listener);
  };

  removeListener(eventKey: EventsT | string, listenerToRemove: EventListener) {
    const hasEvents = this.events[eventKey] != null;

    // event does not exist (maybe: throw an error?)
    if (!hasEvents) return;

    this.events[eventKey] = this.events[eventKey].filter(listener => (
      listener !== listenerToRemove
    ));
  };

  once(eventKey: EventsT | string, listener: EventListener){
    const tempListener: EventListener = (data) => {
      listener(data);
      this.removeListener(eventKey, tempListener);
    };

    this.addListener(eventKey, tempListener);
  };

  removeAllListeners(){
    this.events = {};
  };

  emit(eventKey: EventsT | string, data: any) {
    const hasEvents = this.events[eventKey] != null;

    // event does not exist
    if (!hasEvents) return;

    this.events[eventKey].forEach(callback => {
      callback(data);
    });
  };
};