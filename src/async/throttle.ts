// src/async/throttle.ts
/**
 * Creates a throttled function that only invokes once per the specified time
 * @param fn Function to throttle
 * @param wait Time to wait in milliseconds
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
	fn: T,
	wait: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
	let lastCall = 0;
	let lastResult: ReturnType<T> | undefined;
	let timeout: ReturnType<typeof setTimeout> | null = null;
	let lastArgs: Parameters<T> | null = null;

	function throttled(
		this: unknown,
		...args: Parameters<T>
	): ReturnType<T> | undefined {
		const now = Date.now();
		const timeSinceLastCall = now - lastCall;

		lastArgs = args;

		if (timeSinceLastCall >= wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}

			lastCall = now;
			lastResult = fn.apply(this, args) as ReturnType<T>;
			return lastResult;
		}

		if (!timeout) {
			timeout = setTimeout(() => {
				lastCall = Date.now();
				timeout = null;
				if (lastArgs) {
					lastResult = fn.apply(this, lastArgs) as ReturnType<T>;
					lastArgs = null;
				}
			}, wait - timeSinceLastCall);
		}

		return lastResult;
	}
	return throttled;
}
