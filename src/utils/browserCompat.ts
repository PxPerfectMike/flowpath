// src/utils/browserCompat.ts

/**
 * Utility functions for browser compatibility
 */

/**
 * Checks if the runtime environment supports a specific feature
 * @param feature Feature to check
 */
type Feature =
	| 'Promise'
	| 'Map'
	| 'Set'
	| 'Symbol'
	| 'Array.from'
	| 'Object.assign'
	| 'String.padStart'
	| 'String.padEnd'
	| 'requestAnimationFrame'
	| 'URLSearchParams'
	| 'fetch'
	| 'CustomEvent'
	| 'IntersectionObserver';

/**
 * Safely tests property existence without triggering type errors
 */
function safelyHasProperty<T>(obj: unknown, prop: PropertyKey): obj is T {
	return Boolean(obj && typeof obj === 'object' && prop in obj);
}

/**
 * Safely gets a property from an object with type checking
 */
function safelyGetProperty<T, K extends PropertyKey>(
	obj: unknown,
	prop: K
): unknown {
	if (obj && typeof obj === 'object' && prop in obj) {
		return (obj as Record<K, unknown>)[prop];
	}
	return undefined;
}

/**
 * Checks if a specific browser feature is supported
 * @param feature Feature to check
 */
export function isSupported(feature: Feature): boolean {
	if (typeof window === 'undefined') {
		// Assume Node.js environment supports most features
		return true;
	}

	switch (feature) {
		case 'Promise':
			return typeof Promise !== 'undefined';
		case 'Map':
			return typeof Map !== 'undefined';
		case 'Set':
			return typeof Set !== 'undefined';
		case 'Symbol':
			return typeof Symbol !== 'undefined';
		case 'Array.from':
			return typeof Array.from !== 'undefined';
		case 'Object.assign':
			return typeof Object.assign !== 'undefined';
		case 'String.padStart':
			return typeof String.prototype.padStart === 'function';
		case 'String.padEnd':
			return typeof String.prototype.padEnd === 'function';
		case 'requestAnimationFrame':
			return typeof window.requestAnimationFrame !== 'undefined';
		case 'URLSearchParams':
			return typeof URLSearchParams !== 'undefined';
		case 'fetch':
			return typeof fetch !== 'undefined';
		case 'CustomEvent':
			return typeof CustomEvent !== 'undefined';
		case 'IntersectionObserver':
			return typeof IntersectionObserver !== 'undefined';
		default:
			return false;
	}
}

/**
 * Type for a mapping function used with arrayFrom
 */
type ArrayMapFn<T, U> = (value: T, index: number) => U;

/**
 * Safe version of Array.from that falls back to a manual implementation
 * when the native method is not available
 */
export function arrayFrom<T, U = T>(
	arrayLike: ArrayLike<T> | Iterable<T>,
	mapFn?: ArrayMapFn<T, U>
): U[] {
	// Use native Array.from if available
	if (typeof Array.from === 'function') {
		return mapFn
			? Array.from(arrayLike, mapFn)
			: (Array.from(arrayLike) as unknown as U[]);
	}

	// Fallback implementation
	const result: U[] = [];

	// Check if it's an iterable
	if (
		typeof Symbol !== 'undefined' &&
		Symbol.iterator &&
		safelyHasProperty<Iterable<T>>(arrayLike, Symbol.iterator)
	) {
		try {
			const iterator = (arrayLike as Iterable<T>)[Symbol.iterator]();
			let item = iterator.next();

			let index = 0;
			while (!item.done) {
				result.push(
					mapFn
						? mapFn(item.value, index)
						: (item.value as unknown as U)
				);
				item = iterator.next();
				index++;
			}

			return result;
		} catch (e) {
			// Fall through to array-like handling if iteration fails
		}
	}

	// Handle array-like objects
	const length = 'length' in arrayLike ? arrayLike.length : 0;

	for (let i = 0; i < length; i++) {
		let value: T;
		if ('length' in arrayLike) {
			value = arrayLike[i];
		} else {
			throw new Error('Expected arrayLike to have a length property');
		}
		result.push(mapFn ? mapFn(value, i) : (value as unknown as U));
	}

	return result;
}

/**
 * Safe version of Object.assign that falls back to a manual implementation
 * when the native method is not available
 */
export function objectAssign<T extends object, U extends object>(
	target: T,
	source: U
): T & U {
	if (typeof Object.assign === 'function') {
		return Object.assign(target, source);
	}

	// Fallback implementation
	const result = target as T & U;

	for (const key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			(result as Record<string, unknown>)[key] = source[key as keyof U];
		}
	}

	return result;
}

/**
 * Safe version of Promise that falls back to a polyfill
 * when the native implementation is not available
 */
export function createPromise<T>(
	executor: (
		resolve: (value: T | PromiseLike<T>) => void,
		reject: (reason?: unknown) => void
	) => void
): Promise<T> {
	// Just use the native Promise or a proper polyfill should be included
	return new Promise<T>(executor);
}

/**
 * Creates a safe setImmediate function that falls back to setTimeout
 * when the native method is not available
 */
export const setImmediate =
	typeof window !== 'undefined' && typeof window.setImmediate === 'function'
		? window.setImmediate.bind(window)
		: (fn: () => void) => setTimeout(fn, 0);

/**
 * Creates a safe requestAnimationFrame function that falls back to setTimeout
 * when the native method is not available
 */
export const requestAnimationFrame =
	typeof window !== 'undefined' &&
	typeof window.requestAnimationFrame === 'function'
		? window.requestAnimationFrame.bind(window)
		: (callback: FrameRequestCallback) => {
				return window.setTimeout(() => {
					callback(Date.now());
				}, 1000 / 60);
		  };

/**
 * Safe version of String.padStart that falls back to a manual implementation
 * when the native method is not available
 */
export function padStart(
	str: string,
	targetLength: number,
	padString = ' '
): string {
	// Use native String.padStart if available
	if (typeof String.prototype.padStart === 'function') {
		return String(str).padStart(targetLength, padString);
	}

	// Fallback implementation
	const inputStr = String(str);
	if (inputStr.length >= targetLength) {
		return inputStr;
	}

	const padLength = targetLength - inputStr.length;
	let padding = padString;

	// If we need to repeat the padding
	if (padLength > padding.length) {
		// Create a new string by repeating the padding
		padding = padding.repeat(Math.ceil(padLength / padding.length));
	}

	return padding.substring(0, padLength) + inputStr;
}

/**
 * Safe version of String.padEnd that falls back to a manual implementation
 * when the native method is not available
 */
export function padEnd(
	str: string,
	targetLength: number,
	padString = ' '
): string {
	// Use native String.padEnd if available
	if (typeof String.prototype.padEnd === 'function') {
		return String(str).padEnd(targetLength, padString);
	}

	// Fallback implementation
	const inputStr = String(str);
	if (inputStr.length >= targetLength) {
		return inputStr;
	}

	const padLength = targetLength - inputStr.length;
	let padding = padString;

	// If we need to repeat the padding
	if (padLength > padding.length) {
		// Create a new string by repeating the padding
		padding = padding.repeat(Math.ceil(padLength / padding.length));
	}

	return inputStr + padding.substring(0, padLength);
}

/**
 * Safe version of String.prototype.repeat that falls back to a manual implementation
 * when the native method is not available
 */
export function repeat(str: string, count: number): string {
	if (typeof String.prototype.repeat === 'function') {
		return str.repeat(count);
	}

	// Fallback implementation
	if (str == null) {
		throw new TypeError(
			'String.prototype.repeat called on null or undefined'
		);
	}

	const string = String(str);
	const n = Math.floor(count);

	if (n < 0 || n === Number.POSITIVE_INFINITY) {
		throw new RangeError('Invalid count value');
	}

	if (n === 0) {
		return '';
	}

	let result = '';
	let stringCopy = string;
	let multiplier = n;

	while (multiplier > 0) {
		if (multiplier & 1) {
			result += stringCopy;
		}

		multiplier >>= 1;
		if (multiplier) {
			stringCopy += stringCopy;
		}
	}

	return result;
}
