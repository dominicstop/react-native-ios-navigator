export type TrackItem = {
  id: number;
  title: string;
  artists:  Array<string>;
  isExplicit?: boolean;
  isLiked?: boolean;
  isDownloaded?: boolean;
};