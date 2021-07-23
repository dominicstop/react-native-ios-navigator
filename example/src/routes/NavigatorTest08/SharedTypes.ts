
export type EventData = {
  timestamp: number;
  eventType: string;
};

export type RecordEvent = (event: EventData) => void;

export type RouteProps = {
  recordEvent: RecordEvent;
};