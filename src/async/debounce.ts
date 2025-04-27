// src/async/debounce.ts
/**
 * Creates a debounced function that delays invoking until after wait
 * @param fn Function to debounce
 * @param wait Wait time in milliseconds
 * @param options Debounce options
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	fn: T,
	wait: number,
	options: { leading?: boolean; trailing?: boolean; maxWait?: number } = {}
): (...args: Parameters<T>) => ReturnType<T> | undefined {
	const { leading = false, trailing = true, maxWait } = options;

	let lastCallTime = 0;
	let lastInvokeTime = 0;
	let timeout: ReturnType<typeof setTimeout> | null = null;
	let lastArgs: Parameters<T> | null = null;
	let lastThis: unknown = null;
	let lastResult: ReturnType<T> | undefined;

	function invokeFunc(): ReturnType<T> | undefined {
		const args = lastArgs;
		const thisArg = lastThis;

		lastArgs = lastThis = null;
		lastInvokeTime = Date.now();

		if (args) {
			lastResult = fn.apply(thisArg, args) as ReturnType<T>;
		}

		return lastResult;
	}
	function shouldInvoke(time: number) {
		const timeSinceLastCall = time - lastCallTime;
		const timeSinceLastInvoke = time - lastInvokeTime;

		return (
			lastCallTime === 0 ||
			timeSinceLastCall >= wait ||
			(maxWait !== undefined && timeSinceLastInvoke >= maxWait)
		);
	}

	function trailingEdge() {
		timeout = null;

		if (trailing && lastArgs) {
			return invokeFunc();
		}

		lastArgs = lastThis = null;
		return lastResult;
	}

	function debounced(
		this: unknown,
		...args: Parameters<T>
	): ReturnType<T> | undefined {
		const time = Date.now();
		const isInvoking = shouldInvoke(time);

		lastArgs = args;
		lastThis = this;
		lastCallTime = time;

		if (isInvoking) {
			if (timeout === null) {
				if (leading) {
					lastInvokeTime = lastCallTime;
					return invokeFunc();
				}
			} else if (maxWait !== undefined) {
				clearTimeout(timeout);
				timeout = setTimeout(trailingEdge, wait);
				return invokeFunc();
			}
		}

		if (timeout === null) {
			timeout = setTimeout(trailingEdge, wait);
		}

		return lastResult;
	}

	return debounced;
}
