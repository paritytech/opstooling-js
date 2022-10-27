import { MaybePromise } from "./types"

export const delay = (milliseconds: number): Promise<void> =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds)
  })

export async function until(
  cb: () => MaybePromise<boolean>,
  interval: number,
  maxRetries: number = Infinity,
  timeoutMessage?: string,
): Promise<void> {
  let retryCount: number = 0

  while (retryCount < maxRetries) {
    const res = await cb()
    if (res) {
      return
    }
    await delay(interval)
    retryCount++
  }

  throw new Error(timeoutMessage ?? "Maximun retry count reached")
}
