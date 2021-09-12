
export enum NavigatorErrorCodes {
  activeRoutesDeSync = "activeRoutesDeSync",
  libraryError       = "libraryError",

  invalidRouteID    = "invalidRouteID",
  invalidRouteKey   = "invalidRouteKey",
  invalidRouteIndex = "invalidRouteIndex",
  invalidReactTag   = "invalidReactTag",
  invalidArguments  = "invalidArguments",
  routeOutOfBounds  = "routeOutOfBounds",

  // JS-only errors
  invalidProps  = "invalidProps",
};

export type NavigatorErrorObject = {
  code: NavigatorErrorCodes;
  domain?: string;
  message?: string;
  debug?: string;
};

export class NavigatorError extends Error {

  name: NavigatorErrorCodes | string;
  message: string;

  constructor(error: Error | NavigatorErrorObject){
    super();
    const errorObj = NavigatorError.parseErrorObject(error)!;

    if(errorObj != null){
      this.name = errorObj.code;
      this.message = NavigatorError.createErrorString(errorObj);

    } else if (error instanceof Error) {
      // the error is a JS error
      this.name    = error.name;
      this.message = error.message;
      this.stack   = error.stack;

    } else {
      this.name = 'error';
      this.message = `${error}`;
    };
  };

  static isNavigatorErrorObject(obj: object): obj is NavigatorErrorObject {
    return('code' in obj && 'domain' in obj);
  };

  /// Navigator-related errors thrown from native are JSON strings
  static parseErrorObject(error: any): NavigatorErrorObject | null {
    const string = 
      (error instanceof Error   )? error.message :
      (typeof error === 'string')? error : null;

    if(string == null) return null;

    const indexStart = string.indexOf('{');
    const indexEnd   = string.indexOf('}');

    const jsonString = string.substring(indexStart, indexEnd + 1);
    
    try {
      const obj = JSON.parse(jsonString);

      if(typeof obj !== 'object') return null;
      if(!NavigatorError.isNavigatorErrorObject(obj)) return null;

      return obj;

    } catch {
      return null;
    };
  };

  static createErrorString(error: Partial<NavigatorErrorObject>): string {
    const domain = (error.domain == null)
      ? 'An error has ocurred'
      : `${error.domain} has failed`;

    const code = (error.domain == null)
      ? '(unknown error code)'
      : `with error code '${error.code}'`;

    const message = (error.message == null)
      ? 'due to an unknown reason'
      : `because ${error.message}`;

    const debug = (error.debug == null)
      ? '.'
      : ` - Debug: ${error.debug}`;
    
    return `${domain} ${code} ${message}` + debug;
  };
};