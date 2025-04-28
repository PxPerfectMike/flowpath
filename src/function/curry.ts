/**
 * Creates a curried version of a function
 * @param fn Function to curry
 * @param arity Number of arguments the function expects
 */
export function curry<T extends (...args: unknown[]) => unknown>(
	fn: T,
	arity = fn.length
): unknown {
	return function curriedFn(...args: unknown[]): unknown {
		if (args.length >= arity) {
			return fn(...args.slice(0, arity));
		}

		return (...moreArgs: unknown[]): unknown =>
			curriedFn(...args.concat(moreArgs));
	};
}
