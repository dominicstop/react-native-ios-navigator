
export type EventData = {
  timestamp: number;
  eventType: string;
  routeKey: string;
  routeIndex: number;
};

export type RecordEvent = (event: EventData) => void;

export type RouteProps = {
  recordEvent: RecordEvent;
};