import type { NavBarItemConfig, NavBarItemsConfig, NavBarBackItemConfig } from "../types/NavBarItemConfig";
import type { RouteOptions } from "../types/NavTypes";
import type { RouteTransitionPushConfig, RouteTransitionPopConfig } from "src/native_components/RNINavigatorRouteView";

// Note: These functions are used to compare objects and decide whether or not to
// to trigger an update or re-render, so it has to be fast.
// Of course, we can use `deepCompare` and `JSON.stringify` to compare two objects,
// but using `&&` ("short-circuit" eval.) will return early once a comparison is false,
// which is a lot faster than serializing an entire object into a string and then 
// comparing them (it also doesn't preserve order, meaning that the comparisons for
// deeply nested objects might be wrong sometimes).
// This is a ugly brute force approach, and there might be other ways to do this, but
// it'll do for now.

class HelperUtilities {
  /** if one value is null, and the other isn't, then they aren't the same. */
  static compareObjectsNull(itemA: object, itemB: object){
    return ((itemA == null) === (itemB == null));
  };

  static compareArraySimple(itemA: Array<any>, itemB: Array<any>){
    return (
      HelperUtilities.compareObjectsNull(itemA, itemB) && 
      (itemA?.length == itemB?.length)
    );
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

export function compareTransitionConfig(
  itemA: RouteTransitionPushConfig | RouteTransitionPopConfig, 
  itemB: RouteTransitionPushConfig | RouteTransitionPopConfig
){
  if(!HelperUtilities.compareObjectsNull(itemA, itemB)) return false;

  return (
    (itemA?.type     === itemB?.type    ) &&
    (itemA?.duration === itemB?.duration)
  );
};

export function compareNavBarItemConfig(itemA: NavBarItemConfig, itemB: NavBarItemConfig){
  return (
    (HelperUtilities.compareObjectsNull           (itemA, itemB)) &&
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
    (HelperUtilities.compareObjectsNull           (itemA, itemB)) && // @ts-ignore
    (HelperUtilities.compareNavBarItemConfigBase  (itemA, itemB)) && // @ts-ignore
    (HelperUtilities.compareNavBarItemConfigShared(itemA, itemB)) &&
    // compare back button config
    (itemA?.applyToPrevBackConfig === itemB?.applyToPrevBackConfig)
  );
};

export function compareRouteOptions(itemA: RouteOptions, itemB: RouteOptions){
  if(!HelperUtilities.compareObjectsNull(itemA, itemB)){
    return false;
  };

  return (
    // Compare: Navbar Config --------------------------------------
    (itemA.routeTitle            === itemB.routeTitle           ) &&
    (itemA.prompt                === itemB.prompt               ) &&
    (itemA.largeTitleDisplayMode === itemB.largeTitleDisplayMode) &&
    // Compare: Navbar back button item config -------------------------------------
    (itemA.hidesBackButton               === itemB.hidesBackButton              ) &&
    (itemA.backButtonTitle               === itemB.backButtonTitle              ) &&
    (itemA.backButtonDisplayMode         === itemB.backButtonDisplayMode        ) &&
    (itemA.leftItemsSupplementBackButton === itemB.leftItemsSupplementBackButton) &&
    // Transition Config -------------------------------------------------------------
    compareTransitionConfig(itemA.transitionConfigPush, itemB.transitionConfigPush) &&
    compareTransitionConfig(itemA.transitionConfigPop , itemB.transitionConfigPop ) &&
    // Compare: Navbar item config -----------------------------------------------------------------------------
    compareNavBarItemsConfig         (itemA.navBarButtonLeftItemsConfig , itemB.navBarButtonLeftItemsConfig ) &&
    compareNavBarItemsConfig         (itemA.navBarButtonRightItemsConfig, itemB.navBarButtonRightItemsConfig) &&
    compareNavBarButtonBackItemConfig(itemA.navBarButtonBackItemConfig  , itemB.navBarButtonBackItemConfig  )
  );
};