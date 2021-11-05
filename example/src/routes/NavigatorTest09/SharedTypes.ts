export type SearchEventData = {
  timestamp: number;
  eventType: string;
  text?: string;
  isActive?: boolean;
};

export type RecordSearchEvent = (event: SearchEventData) => void;