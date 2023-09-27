export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes)
    return {
      value: 0,
      size: 'Bytes',
    };

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  // todo: move to enum
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return {
    value: parseFloat((bytes / k ** i).toFixed(dm)),
    size: sizes[i],
  };
}

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
