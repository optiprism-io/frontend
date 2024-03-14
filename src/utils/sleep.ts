/* The sleep function is a utility function that pauses the execution of the program.
 This can be useful in various scenarios such as simulating network latency during
 development or testing, or to introduce a delay in a sequence of asynchronous operations.*/
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
