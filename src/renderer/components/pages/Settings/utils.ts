export const formatBytes = (bytes: number) => {
  // number of bytes in kilobytes
  const kbytes = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(kbytes));
  return parseInt((bytes / kbytes ** i).toFixed(0), 10);
};

export const getSystemMemory = async () => {
  const memory = await window.electron.ipcRenderer.invoke('get-os-memory');
  return memory;
};
