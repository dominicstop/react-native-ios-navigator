
export type HeaderHeightValue = 
  | number 
  | 'navigationBar'
  | 'statusBar'
  | 'navigationBarWithStatusBar'
  | 'safeArea'
  | 'none';

export type RouteHeaderConfig = {
  headerMode: 'fixed';
  headerHeight?: HeaderHeightValue;
} | {
  headerMode: 'resize';
  headerHeightMin?: HeaderHeightValue;
  headerHeightMax?: HeaderHeightValue;
};