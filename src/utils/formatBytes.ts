export enum MemorySizing {
  BYTES = 'Bytes',
  KB = 'KB',
  MB = 'MB',
  GB = 'GB',
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes)
    return {
      value: 0,
      size: MemorySizing.BYTES,
    };

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;

  const sizes = Object.values(MemorySizing);

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return {
    value: parseFloat((bytes / k ** i).toFixed(dm)),
    size: sizes[i],
  };
}
