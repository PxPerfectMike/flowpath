// src/function/once.ts
/**
 * Creates a function that is only executed once
 * @param fn Function to execute once
 */
export function once<T extends (...args: unknown[]) => unknown>(fn: T): T {
	let result: ReturnType<T>;
	let called = false;

	return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
		if (!called) {
			result = fn.apply(this, args) as ReturnType<T>;
			called = true;
		}
		return result;
	} as T;
}
