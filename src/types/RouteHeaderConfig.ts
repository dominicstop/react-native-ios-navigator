
export type HeaderHeightPreset = 
  | 'navigationBar'
  | 'statusBar'
  | 'navigationBarWithStatusBar'
  | 'safeArea'
  | 'none';

export type HeaderHeightConfig = {
  preset: HeaderHeightPreset;
  offset?: number; 
};

export type RouteHeaderConfig = {
  headerMode: 'fixed';
  headerHeight?: HeaderHeightConfig;
} | {
  headerMode: 'resize';
  headerHeightMin?: HeaderHeightConfig;
  headerHeightMax?: HeaderHeightConfig;
};