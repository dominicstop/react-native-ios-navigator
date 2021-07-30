// Note: Changes in this file is ignored by default.
// * In order to commit changes run:
//   `git update-index --no-assume-unchanged src/constants/LibEnv.ts`
// * To ignore changes, run:
//   `git update-index --assume-unchanged src/constants/LibEnv.ts`

export const LIB_ENV = {
  /** Log debug messages to console */
  debugLog: __DEV__ && false,

  /** Log re-renders of components */
  debugLogRender: __DEV__ && false,
};