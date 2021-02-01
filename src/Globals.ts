
declare var LIB_GLOBAL: {
  /** Whether or not to log debug messages to console */
  debugLog: boolean;
};

LIB_GLOBAL = {
  debugLog: __DEV__ && true,
};