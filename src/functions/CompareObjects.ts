import type { NavBarItemConfig, NavBarItemsConfig, NavBarBackItemConfig } from "../types/NavBarItemConfig";
import type { RouteOptions } from "../components/NavigatorView";

class HelperUtilities {
  static compareObjectSimple(itemA: object, itemB: object){
    return (
      ((itemA == null) == (itemB == null)) &&
      ((itemA && Object.keys(itemA).length) == (itemB && Object.keys(itemB)?.length))
    );
  };

  static compareArraySimple(itemA: Array<any>, itemB: Array<any>){
    return ((itemA == null) == (itemB == null)) && (itemA?.length == itemB?.length);
  };

  static compareNavBarItemConfigBase(itemA: NavBarItemConfig, itemB: NavBarItemConfig){
    return (
      (itemA?.type       === itemB?.type      ) && // @ts-ignore
      (itemA?.title      === itemB?.title     ) && // @ts-ignore
      (itemA?.imageValue === itemB?.imageValue) 
    );
  };

  static compareNavBarItemConfigShared(itemA: NavBarItemConfig, itemB: NavBarItemConfig){
    return (
      (itemA?.key                === itemB?.key                ) &&
      (itemA?.tintColor          === itemB?.tintColor          ) &&
      (itemA?.barButtonItemStyle === itemB?.barButtonItemStyle ) &&
      (itemA?.possibleTitles     === itemB?.possibleTitles     ) &&
      (itemA?.width              === itemB?.width              )
    );
  };
};

export function compareNavBarItemConfig(itemA: NavBarItemConfig, itemB: NavBarItemConfig){
  return (
    (HelperUtilities.compareObjectSimple          (itemA, itemB)) &&
    (HelperUtilities.compareNavBarItemConfigBase  (itemA, itemB)) &&
    (HelperUtilities.compareNavBarItemConfigShared(itemA, itemB))
  );
};

export function compareNavBarItemsConfig(itemA: NavBarItemsConfig, itemB: NavBarItemsConfig){
  if(!HelperUtilities.compareArraySimple(itemA, itemB)) return false;
  
  for (let i = 0; i < itemA?.length ?? 0; i++) {
    if(!compareNavBarItemConfig(itemA[i], itemB[i])) return false;
  };

  return true;
};

export function compareNavBarButtonBackItemConfig(itemA: NavBarBackItemConfig, itemB: NavBarBackItemConfig){
  return (
    (HelperUtilities.compareObjectSimple          (itemA, itemB)) && // @ts-ignore
    (HelperUtilities.compareNavBarItemConfigBase  (itemA, itemB)) && // @ts-ignore
    (HelperUtilities.compareNavBarItemConfigShared(itemA, itemB))
  );
};

export function compareRouteOptions(itemA: RouteOptions, itemB: RouteOptions){
  if(!HelperUtilities.compareObjectSimple(itemA, itemB)){
    return false;
  };

  return (
    (itemA.routeTitle                    === itemB.routeTitle                   ) &&
    (itemA.hidesBackButton               === itemB.hidesBackButton              ) &&
    (itemA.backButtonTitle               === itemB.backButtonTitle              ) &&
    (itemA.backButtonDisplayMode         === itemB.backButtonDisplayMode        ) &&
    (itemA.leftItemsSupplementBackButton === itemB.leftItemsSupplementBackButton) &&
    compareNavBarItemsConfig         (itemA.navBarButtonLeftItemsConfig , itemB.navBarButtonLeftItemsConfig ) &&
    compareNavBarItemsConfig         (itemA.navBarButtonRightItemsConfig, itemB.navBarButtonRightItemsConfig) &&
    compareNavBarButtonBackItemConfig(itemA.navBarButtonBackItemConfig  , itemB.navBarButtonBackItemConfig  )
  );
};