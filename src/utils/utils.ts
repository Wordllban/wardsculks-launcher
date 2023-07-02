export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes)
    return {
      value: 0,
      size: 'Bytes',
    };

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return {
    value: parseFloat((bytes / k ** i).toFixed(dm)),
    size: sizes[i],
  };
}
