export async function sleep(sleepTime: number): Promise<null> {
  await new Promise((resolve) => {
    setTimeout(resolve, sleepTime);
  });
  return null;
}
