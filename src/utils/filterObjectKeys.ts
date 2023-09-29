/**
 * Helper to filter keys in objects by key name.
 *
 * @param {Record<string, unknown>} object - any object
 * @param {Function} conditionCallback - callback that will be called in each key
 */
export const filterObjectKeys = <T>(
  object: Record<string, T>,
  conditionCallback: (keyToCheck: string) => boolean
) => {
  const filtered: Record<string | number, T> = {};

  Object.keys(object).forEach((key: string) => {
    if (conditionCallback(key)) {
      filtered[key] = object[key];
    }
  });

  return filtered;
};
