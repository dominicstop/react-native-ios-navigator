

export type SearchBarState = {
  text?: string;
  
  showsBookmarkButton: boolean;
  showsCancelButton: boolean;
  showsSearchResultsButton: boolean;

  showsScopeBar: boolean;
  selectedScopeButtonIndex: number;

  isSearchResultsButtonSelected: boolean;
}; 

export type SearchControllerState = {
  isActive: boolean;
};

export type RouteSearchControllerState = 
  SearchBarState & SearchControllerState;